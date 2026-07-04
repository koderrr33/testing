import type { DisplaySize } from "@/lib/products/types";

export type OrderStatus = "PENDING" | "PAID" | "EXPIRED" | "CANCELLED";

export type OrderLineItem = {
  productSlug: string;
  productName: string;
  size: DisplaySize;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  externalId: string;
  xenditInvoiceId?: string;
  invoiceUrl?: string;
  status: OrderStatus;
  lineItems: OrderLineItem[];
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: Date;
  paidAt?: Date;
  expiredAt?: Date;
  cancelledAt?: Date;
};

export type CreateOrderInput = {
  externalId: string;
  lineItems: OrderLineItem[];
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
};

export type UpdateOrderInput = {
  status?: OrderStatus;
  xenditInvoiceId?: string;
  invoiceUrl?: string;
  paidAt?: Date;
  expiredAt?: Date;
  cancelledAt?: Date;
};
