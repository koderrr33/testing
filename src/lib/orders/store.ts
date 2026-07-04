import type { CreateOrderInput, Order, UpdateOrderInput } from "./types";

/**
 * In-memory order store for development.
 * Replace with Prisma/Drizzle/Supabase before production deploy.
 */
const orders = new Map<string, Order>();

export function createOrder(input: CreateOrderInput): Order {
  const order: Order = {
    ...input,
    status: "PENDING",
    createdAt: new Date(),
  };
  orders.set(input.externalId, order);
  return order;
}

export function getOrderByExternalId(externalId: string): Order | undefined {
  return orders.get(externalId);
}

export function updateOrderByExternalId(
  externalId: string,
  patch: UpdateOrderInput,
): Order | undefined {
  const existing = orders.get(externalId);
  if (!existing) return undefined;

  const updated: Order = { ...existing, ...patch };
  orders.set(externalId, updated);
  return updated;
}
