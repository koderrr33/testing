export { products } from "@/data/products";

export type {
  DisplaySize,
  FilterCategory,
  FilterSize,
  Product,
  ProductCategory,
  ProductSize,
  ShopFilterCategory,
} from "./types";

export { displaySizes } from "./types";

export {
  categoryFilters,
  isValidShopFilterCategory,
  productMatchesShopFilter,
  shopCategoryFilters,
  sizeFilters,
} from "./filters";

export {
  getProductBySlug,
  getRelatedProducts,
  isSizeAvailable,
  MAX_SEARCH_QUERY_LENGTH,
  normalizeSearchQuery,
  searchProducts,
} from "./helpers";
