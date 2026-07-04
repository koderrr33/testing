export type ProductCategory = "jacket" | "snowboard" | "ski" | "goggles";

export type ProductSize = "M" | "L" | "XL";

export const displaySizes = ["XS", "S", "M", "L", "XL"] as const;

export type DisplaySize = (typeof displaySizes)[number];

export type ProductColor = {
  id: string;
  className: string;
  label: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  badge?: string;
  category: ProductCategory;
  sizes: ProductSize[];
  image: string;
  imagePosition?: string;
  colors?: ProductColor[];
  price: number;
  description?: string;
  colorLabel?: string;
  fitNote?: string;
  sizingInfo?: string[];
  shippingInfo?: string[];
  returnsInfo?: string[];
};

export type FilterCategory = "all" | ProductCategory;

export type FilterSize = "all" | ProductSize;

export type ShopFilterCategory = "all" | ProductCategory;
