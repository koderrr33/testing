import { prisma } from "@/lib/prisma";
import type { CreateOrderInput, Order, UpdateOrderInput } from "./types";

function toOrder(row: { externalId: string; userId: string | null; xenditInvoiceId: string | null; invoiceUrl: string | null; status: string; lineItems: unknown; amount: number; customerName: string; customerEmail: string; customerPhone: string; createdAt: Date; paidAt: Date | null; expiredAt: Date | null; cancelledAt: Date | null }): Order {
  return {
    externalId: row.externalId,
    userId: row.userId ?? undefined,
    xenditInvoiceId: row.xenditInvoiceId ?? undefined,
    invoiceUrl: row.invoiceUrl ?? undefined,
    status: row.status as Order["status"],
    lineItems: row.lineItems as Order["lineItems"],
    amount: row.amount,
    customerName: row.customerName,
    customerEmail: row.customerEmail,
    customerPhone: row.customerPhone,
    createdAt: row.createdAt,
    paidAt: row.paidAt ?? undefined,
    expiredAt: row.expiredAt ?? undefined,
    cancelledAt: row.cancelledAt ?? undefined,
  };
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const row = await prisma.order.create({
    data: {
      externalId: input.externalId,
      userId: input.userId,
      lineItems: input.lineItems as object,
      amount: input.amount,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      status: "PENDING",
    },
  });
  return toOrder(row);
}

export async function getOrderByExternalId(externalId: string): Promise<Order | null> {
  const row = await prisma.order.findUnique({ where: { externalId } });
  if (!row) return null;
  return toOrder(row);
}

export async function updateOrderByExternalId(
  externalId: string,
  patch: UpdateOrderInput,
): Promise<Order | null> {
  const existing = await prisma.order.findUnique({ where: { externalId } });
  if (!existing) return null;

  const row = await prisma.order.update({
    where: { externalId },
    data: {
      xenditInvoiceId: patch.xenditInvoiceId,
      invoiceUrl: patch.invoiceUrl,
      status: patch.status,
      paidAt: patch.paidAt,
      expiredAt: patch.expiredAt,
      cancelledAt: patch.cancelledAt,
    },
  });
  return toOrder(row);
}

export async function getOrdersByUserId(
  userId: string,
  limit = 20,
  offset = 0,
): Promise<{ orders: Order[]; total: number }> {
  const [rows, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.order.count({ where: { userId } }),
  ]);
  return { orders: rows.map(toOrder), total };
}
