"use server";

import {
  cartCheckoutSchema,
  checkoutSchema,
} from "@/schemas/checkout";
import {
  getOrderByExternalId,
  updateOrderByExternalId,
} from "@/lib/orders";
import { auth } from "@/lib/next-auth";
import type { Order, OrderLineItem } from "@/lib/orders";
import { getProductBySlug } from "@/lib/products/db";
import { isSizeAvailable } from "@/lib/products";
import {
  createInvoice,
  getInvoice,
  isPaidStatus,
  toCheckoutErrorMessage,
  type XenditInvoiceStatus,
} from "@/lib/xendit";
import { prisma } from "@/lib/prisma";

export type CheckoutActionState = {
  ok: boolean;
  redirectUrl?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

function getAppUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (!url) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "NEXT_PUBLIC_APP_URL wajib diisi di environment production. " +
        "Set ke domain kamu (https://domainkamu.com).",
      );
    }
    return "http://localhost:3000";
  }
  return url;
}

function generateExternalId(): string {
  return `ORD-${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 12)}`;
}

function mapXenditStatus(status: XenditInvoiceStatus): Order["status"] | null {
  if (isPaidStatus(status)) return "PAID";
  if (status === "EXPIRED") return "EXPIRED";
  return null;
}

async function resolveLineItems(
  items: Array<{ productSlug: string; size: OrderLineItem["size"]; quantity: number }>,
): Promise<{ lineItems: OrderLineItem[]; amount: number } | { error: string }> {
  const lineItems: OrderLineItem[] = [];
  let amount = 0;

  for (const item of items) {
    const product = await getProductBySlug(item.productSlug);
    if (!product) {
      return { error: `Produk "${item.productSlug}" tidak ditemukan.` };
    }
    if (!isSizeAvailable(product, item.size)) {
      return { error: `Ukuran ${item.size} tidak tersedia untuk ${product.name}.` };
    }

    lineItems.push({
      productSlug: product.slug,
      productName: product.name,
      size: item.size,
      quantity: item.quantity,
      unitPrice: product.price,
    });
    amount += product.price * item.quantity;
  }

  return { lineItems, amount };
}

async function processCheckout(
  lineItems: OrderLineItem[],
  amount: number,
  customer: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  },
  failureRedirectUrl: string,
  userId?: string,
): Promise<CheckoutActionState> {
  const externalId = generateExternalId();
  const appUrl = getAppUrl();

  try {
    await prisma.$transaction(async (tx) => {
      // Check and decrement stock for each item
      for (const item of lineItems) {
        const product = await tx.product.findUnique({
          where: { slug: item.productSlug },
        });
        if (!product) {
          throw new Error(`Produk "${item.productSlug}" tidak ditemukan.`);
        }
        const stock = product.stock as Record<string, number>;
        const currentStock = stock[item.size] ?? 0;
        if (currentStock < item.quantity) {
          throw new Error(`Stok ${item.size} untuk ${product.name} tidak mencukupi. Tersisa ${currentStock}.`);
        }
        stock[item.size] = currentStock - item.quantity;
        await tx.product.update({
          where: { slug: item.productSlug },
          data: { stock: stock as object },
        });
      }

      await tx.order.create({
        data: {
          externalId,
          userId,
          lineItems: lineItems as object,
          amount,
          customerName: customer.customerName,
          customerEmail: customer.customerEmail,
          customerPhone: customer.customerPhone,
          status: "PENDING",
        },
      });

    });

    const description =
      lineItems.length === 1
        ? `${lineItems[0].productName} (${lineItems[0].size}) x${lineItems[0].quantity}`
        : `${lineItems.length} items — yourbrand order`;

    const invoice = await createInvoice({
      externalId,
      amount,
      payerEmail: customer.customerEmail,
      description,
      customer: {
        given_names: customer.customerName,
        email: customer.customerEmail,
        mobile_number: customer.customerPhone,
      },
      items: lineItems.map((item) => ({
        name: `${item.productName} — ${item.size}`,
        quantity: item.quantity,
        price: item.unitPrice,
      })),
      successRedirectUrl: `${appUrl}/checkout/success?order=${externalId}`,
      failureRedirectUrl: `${failureRedirectUrl}${failureRedirectUrl.includes("?") ? "&" : "?"}order=${externalId}`,
    });

    await updateOrderByExternalId(externalId, {
      xenditInvoiceId: invoice.id,
      invoiceUrl: invoice.invoice_url,
    });

    return { ok: true, redirectUrl: invoice.invoice_url };
  } catch (err) {
    await updateOrderByExternalId(externalId, { status: "CANCELLED", cancelledAt: new Date() });
    return { ok: false, error: toCheckoutErrorMessage(err) };
  }
}

export async function createCheckoutOrder(
  _prev: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Silakan login terlebih dahulu untuk checkout." };
  }
  const userId = session.user.id;

  const parsed = checkoutSchema.safeParse({
    productSlug: formData.get("productSlug"),
    size: formData.get("size"),
    quantity: formData.get("quantity"),
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const data = parsed.data;
  const resolved = await resolveLineItems([
    {
      productSlug: data.productSlug,
      size: data.size,
      quantity: data.quantity,
    },
  ]);

  if ("error" in resolved) {
    return { ok: false, error: resolved.error };
  }

  return processCheckout(
    resolved.lineItems,
    resolved.amount,
    {
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
    },
    `${getAppUrl()}/checkout?slug=${data.productSlug}&size=${data.size}&failed=1`,
    userId,
  );
}

export async function createCartCheckoutOrder(
  _prev: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Silakan login terlebih dahulu untuk checkout." };
  }
  const userId = session.user.id;

  let itemsRaw: unknown;
  try {
    itemsRaw = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return { ok: false, error: "Data cart tidak valid." };
  }

  const parsed = cartCheckoutSchema.safeParse({
    items: itemsRaw,
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
      error: parsed.error.flatten().formErrors[0],
    };
  }

  const resolved = await resolveLineItems(parsed.data.items);
  if ("error" in resolved) {
    return { ok: false, error: resolved.error };
  }

  return processCheckout(
    resolved.lineItems,
    resolved.amount,
    {
      customerName: parsed.data.customerName,
      customerEmail: parsed.data.customerEmail,
      customerPhone: parsed.data.customerPhone,
    },
    `${getAppUrl()}/checkout?from=cart&failed=1`,
    userId,
  );
}

/** Dipanggil saat user balik dari failure_redirect_url Xendit */
export async function markOrderCancelledIfPending(
  externalId: string,
): Promise<Order | null> {
  const order = await getOrderByExternalId(externalId);
  if (!order || order.status !== "PENDING") return order ?? null;

  const updated = await updateOrderByExternalId(externalId, {
    status: "CANCELLED",
    cancelledAt: new Date(),
  });
  return updated ?? order;
}

export async function syncOrderPaymentStatus(
  externalId: string,
): Promise<Order | null> {
  const order = await getOrderByExternalId(externalId);
  if (!order) return null;

  if (
    order.status === "PAID" ||
    order.status === "EXPIRED" ||
    order.status === "CANCELLED"
  ) {
    return order;
  }

  if (!order.xenditInvoiceId) return order;

  try {
    const invoice = await getInvoice(order.xenditInvoiceId);
    const mapped = mapXenditStatus(invoice.status);

    if (mapped === "PAID") {
      return (
        await updateOrderByExternalId(externalId, {
          status: "PAID",
          paidAt: new Date(),
        })
      ) ?? order;
    }

    if (mapped === "EXPIRED") {
      return (
        await updateOrderByExternalId(externalId, {
          status: "EXPIRED",
          expiredAt: new Date(),
        })
      ) ?? order;
    }
  } catch {
    return order;
  }

  return order;
}

export async function getCheckoutOrder(
  externalId: string,
): Promise<Order | null> {
  if (!externalId) return null;
  return syncOrderPaymentStatus(externalId);
}
