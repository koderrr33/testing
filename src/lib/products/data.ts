import type { Product } from "./types";

export function isSizeAvailable(
  product: Product,
  size: string,
): boolean {
  if (product.badge === "CUSTOM ORDER") return true;
  if (size === "XS" || size === "S") return false;
  return product.sizes.includes(size as Product["sizes"][number]);
}

export function normalizeSearchQuery(query: string): string {
  return query.trim().slice(0, 100);
}
