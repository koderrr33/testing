import { products } from "@/data/products";
import type { DisplaySize, Product, ProductSize } from "./types";

export const MAX_SEARCH_QUERY_LENGTH = 100;

export function normalizeSearchQuery(query: string): string {
  return query.trim().slice(0, MAX_SEARCH_QUERY_LENGTH);
}

export function searchProducts(query: string): Product[] {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) return [];

  const terms = normalized.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  return products.filter((product) => {
    const haystack = [
      product.name,
      product.slug,
      product.category,
      product.description ?? "",
      product.badge ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return terms.every((term) => haystack.includes(term));
  });
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(slug: string, limit = 3): Product[] {
  return products.filter((product) => product.slug !== slug).slice(0, limit);
}

export function isSizeAvailable(
  product: Product,
  size: DisplaySize,
): boolean {
  if (product.badge === "CUSTOM ORDER") return true;
  if (size === "XS" || size === "S") return false;
  return product.sizes.includes(size as ProductSize);
}
