import { notFound } from "next/navigation";
import { OrderDetailClient } from "@/components/admin/order-detail-client";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ externalId: string }>;
};

type LineItem = {
  productSlug: string;
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
};

export default async function OrderDetailPage({ params }: PageProps) {
  const { externalId } = await params;

  const order = await prisma.order.findUnique({
    where: { externalId },
  });
  if (!order) notFound();

  const lineItems = (order.lineItems as LineItem[]) ?? [];
  const slugs = lineItems.map((item) => item.productSlug);
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    select: { slug: true, images: true },
  });
  const imageBySlug = Object.fromEntries(
    products.map((p) => [p.slug, p.images[0]]),
  );

  const enrichedLineItems = lineItems.map((item) => ({
    ...item,
    image: imageBySlug[item.productSlug],
  }));

  return (
    <OrderDetailClient
      order={{
        externalId: order.externalId,
        status: order.status,
        amount: order.amount,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        invoiceUrl: order.invoiceUrl,
        xenditInvoiceId: order.xenditInvoiceId,
        createdAt: order.createdAt.toISOString(),
        paidAt: order.paidAt?.toISOString() ?? null,
        expiredAt: order.expiredAt?.toISOString() ?? null,
        cancelledAt: order.cancelledAt?.toISOString() ?? null,
        lineItems: enrichedLineItems,
      }}
    />
  );
}
