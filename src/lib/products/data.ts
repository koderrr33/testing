import type { ProductColor, Product, ProductSize } from "./types";

const defaultColors: ProductColor[] = [
  { id: "black", className: "bg-black", label: "Black" },
  { id: "grey", className: "bg-neutral-400", label: "Grey" },
  { id: "white", className: "bg-white ring-1 ring-black/10", label: "White" },
];

const defaultSizes: ProductSize[] = ["M", "L", "XL"];

const productImage = "/images/products/winter/product.webp";

export const products: Product[] = [
  {
    id: "w1",
    slug: "yourproduct-1",
    name: "Yourproduct 1",
    category: "goggles",
    sizes: defaultSizes,
    image: productImage,
    imagePosition: "object-[50%_20%]",
    colors: defaultColors,
    price: 123_456,
    description:
      "Premium winter goggles with anti-fog lens and UV protection. Designed for maximum clarity in extreme conditions.",
    colorLabel: "Black / Grey / White",
  },
  {
    id: "w2",
    slug: "yourproduct-2",
    name: "Yourproduct 2",
    category: "jacket",
    sizes: defaultSizes,
    image: productImage,
    imagePosition: "object-[60%_35%]",
    colors: defaultColors,
    price: 123_456,
    description: "Lightweight yet insulated winter jacket with waterproof shell. Ideal for snow days.",
    colorLabel: "Black / Grey / White",
  },
  {
    id: "w3",
    slug: "yourproduct-3",
    name: "Yourproduct 3",
    category: "jacket",
    sizes: defaultSizes,
    image: productImage,
    imagePosition: "object-[45%_40%]",
    colors: defaultColors,
    price: 123_456,
    description: "Ultra-warm puffer jacket with down alternative fill and windproof fabric.",
    colorLabel: "Black / Grey / White",
  },
  {
    id: "w4",
    slug: "yourproduct-4",
    name: "Yourproduct 4",
    category: "ski",
    sizes: defaultSizes,
    image: productImage,
    imagePosition: "object-[55%_30%]",
    colors: defaultColors,
    price: 123_456,
    description: "Complete ski set featuring lightweight skis with carbon core and precision bindings.",
    colorLabel: "Black / Grey / White",
  },
  {
    id: "w5",
    slug: "yourproduct-5",
    name: "Yourproduct 5",
    category: "snowboard",
    sizes: defaultSizes,
    image: productImage,
    imagePosition: "object-[50%_45%]",
    colors: defaultColors,
    price: 123_456,
    description: "All-mountain snowboard with camber profile, featuring a durable sintered base.",
    colorLabel: "Black / Grey / White",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getNewArrivals(): Product[] {
  return products;
}

export function getRelatedProducts(slug: string, limit = 3): Product[] {
  return products.filter((p) => p.slug !== slug).slice(0, limit);
}

export function normalizeSearchQuery(query: string): string {
  return query.trim().slice(0, 100);
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

export function isSizeAvailable(
  product: Product,
  size: string,
): boolean {
  if (product.badge === "CUSTOM ORDER") return true;
  if (size === "XS" || size === "S") return false;
  return product.sizes.includes(size as ProductSize);
}