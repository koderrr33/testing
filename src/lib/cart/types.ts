import type { DisplaySize } from "@/lib/products/types";

export type CartItem = {
  id: string;
  productSlug: string;
  productName: string;
  size: DisplaySize;
  quantity: number;
  price: number;
  image: string;
};

export function getCartItemId(productSlug: string, size: DisplaySize): string {
  return `${productSlug}::${size}`;
}
