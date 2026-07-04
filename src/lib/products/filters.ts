import type {
  FilterCategory,
  FilterSize,
  Product,
  ShopFilterCategory,
} from "./types";

export const shopCategoryFilters: {
  value: ShopFilterCategory;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "jacket", label: "Jackets" },
  { value: "snowboard", label: "Snowboard" },
  { value: "ski", label: "Ski" },
  { value: "goggles", label: "Goggles" },
];

export function productMatchesShopFilter(
  product: Product,
  filter: ShopFilterCategory,
): boolean {
  if (filter === "all") return true;
  return product.category === filter;
}

export function isValidShopFilterCategory(
  value: string | undefined,
): value is ShopFilterCategory {
  return shopCategoryFilters.some((item) => item.value === value);
}

export const categoryFilters: { value: FilterCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "jacket", label: "Jackets" },
  { value: "snowboard", label: "Snowboard" },
  { value: "ski", label: "Ski" },
  { value: "goggles", label: "Goggles" },
];

export const sizeFilters: { value: FilterSize; label: string }[] = [
  { value: "M", label: "Size M" },
  { value: "L", label: "Size L" },
];
