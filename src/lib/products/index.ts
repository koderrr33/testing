export {
  products,
  getProductBySlug,
  getNewArrivals,
  getRelatedProducts,
  isSizeAvailable,
  normalizeSearchQuery,
  searchProducts,
} from "./data";

export { MAX_SEARCH_QUERY_LENGTH } from "./helpers";

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