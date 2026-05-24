export type ProductCategory = "hoodie" | "jersey" | "tracktop";
export type ProductSize = "M" | "L" | "XL";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  sizes: ProductSize[];
  image: string;
};

export const products: Product[] = [
  {
    id: "1",
    slug: "reality-club-hoodie",
    name: "Reality Club Hoodie",
    category: "hoodie",
    sizes: ["M", "L", "XL"],
    image: "/images/hero-hoodie.png",
  },
  {
    id: "2",
    slug: "lany-jersey",
    name: "LANY Jersey",
    category: "jersey",
    sizes: ["M", "L"],
    image: "/images/hero-hoodie.png",
  },
  {
    id: "3",
    slug: "grid-patch-tee",
    name: "Grid Patch Tee",
    category: "jersey",
    sizes: ["M", "L", "XL"],
    image: "/images/hero-hoodie.png",
  },
  {
    id: "4",
    slug: "handpaint-tracktop",
    name: "Handpaint Tracktop",
    category: "tracktop",
    sizes: ["L", "XL"],
    image: "/images/hero-hoodie.png",
  },
  {
    id: "5",
    slug: "limited-drop-hoodie",
    name: "Limited Drop Hoodie",
    category: "hoodie",
    sizes: ["M", "L"],
    image: "/images/hero-hoodie.png",
  },
  {
    id: "6",
    slug: "custom-order-jersey",
    name: "Custom Order Jersey",
    category: "jersey",
    sizes: ["M", "L", "XL"],
    image: "/images/hero-hoodie.png",
  },
  {
    id: "7",
    slug: "street-tracktop",
    name: "Street Tracktop",
    category: "tracktop",
    sizes: ["M", "L"],
    image: "/images/hero-hoodie.png",
  },
  {
    id: "8",
    slug: "archive-hoodie",
    name: "Archive Hoodie",
    category: "hoodie",
    sizes: ["L", "XL"],
    image: "/images/hero-hoodie.png",
  },
  {
    id: "9",
    slug: "paint-splash-jersey",
    name: "Paint Splash Jersey",
    category: "jersey",
    sizes: ["M", "XL"],
    image: "/images/hero-hoodie.png",
  },
  {
    id: "10",
    slug: "essentials-tracktop",
    name: "Essentials Tracktop",
    category: "tracktop",
    sizes: ["M", "L", "XL"],
    image: "/images/hero-hoodie.png",
  },
  {
    id: "11",
    slug: "midnight-hoodie",
    name: "Midnight Hoodie",
    category: "hoodie",
    sizes: ["M", "L"],
    image: "/images/hero-hoodie.png",
  },
  {
    id: "12",
    slug: "studio-jersey",
    name: "Studio Jersey",
    category: "jersey",
    sizes: ["L", "XL"],
    image: "/images/hero-hoodie.png",
  },
];

export type FilterCategory = "all" | ProductCategory;
export type FilterSize = "all" | ProductSize;

export const categoryFilters: { value: FilterCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "hoodie", label: "Hoodie" },
  { value: "jersey", label: "Jersey" },
  { value: "tracktop", label: "Tracktop" },
];

export const sizeFilters: { value: FilterSize; label: string }[] = [
  { value: "M", label: "Size M" },
  { value: "L", label: "Size L" },
];
