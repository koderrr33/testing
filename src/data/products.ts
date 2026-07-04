import type { Product } from "@/lib/products/types";

const DEFAULT_SIZES: Product["sizes"] = ["M", "L", "XL"];

const WINTER_DESCRIPTION =
  "Engineered for cold-weather performance. Monochrome winter sport gear from .bbr — built to move fast and stay warm on the mountain.";

export const products: Product[] = [
  {
    id: "w1",
    slug: "winter-helmet-bbr",
    name: "Winter Helmet BBR",
    category: "goggles",
    sizes: DEFAULT_SIZES,
    image: "/images/products/winter/winter-goggles-pro.jpg",
    price: 123_456,
    description: WINTER_DESCRIPTION,
    colorLabel: "Black / Grey / White",
  },
  {
    id: "w2",
    slug: "winter-skate-bbr",
    name: "Winter Skate BBR",
    category: "snowboard",
    sizes: DEFAULT_SIZES,
    image: "/images/products/winter/winter-jacket-white.jpg",
    price: 123_456,
    description: WINTER_DESCRIPTION,
    colorLabel: "Black / Grey / White",
  },
  {
    id: "w3",
    slug: "winter-glass-bbr",
    name: "Winter Glass BBR",
    category: "goggles",
    sizes: DEFAULT_SIZES,
    image: "/images/products/winter/winter-puffer-jacket.jpg",
    price: 123_456,
    description: WINTER_DESCRIPTION,
    colorLabel: "Black / Grey / White",
  },
  {
    id: "w4",
    slug: "winter-jacket-v2-bbr",
    name: "Winter Jacket V.2 BBR",
    category: "jacket",
    sizes: DEFAULT_SIZES,
    image: "/images/products/winter/winter-ski-set.jpg",
    price: 123_456,
    description: WINTER_DESCRIPTION,
    colorLabel: "Black / Grey / White",
  },
  {
    id: "w5",
    slug: "winter-glove-bbr",
    name: "Winter Glove BBR",
    category: "ski",
    sizes: DEFAULT_SIZES,
    image: "/images/products/winter/winter-snowboard-kit.jpg",
    price: 123_456,
    description: WINTER_DESCRIPTION,
    colorLabel: "Black / Grey / White",
  },
];
