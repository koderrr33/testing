export type NewArrivalColor = {
  id: string;
  className: string;
  label: string;
};

export type NewArrivalProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  imagePosition: string;
  colors: NewArrivalColor[];
};

const defaultColors: NewArrivalColor[] = [
  { id: "black", className: "bg-black", label: "Black" },
  { id: "grey", className: "bg-neutral-400", label: "Grey" },
  { id: "white", className: "bg-white ring-1 ring-black/10", label: "White" },
];

export const newArrivalProducts: NewArrivalProduct[] = [
  {
    id: "1",
    slug: "winter-helmet-bbr",
    name: "Winter Helmet BBR",
    price: 123_456,
    image: "/images/products/winter/winter-goggles-pro.jpg",
    imagePosition: "object-[50%_20%]",
    colors: defaultColors,
  },
  {
    id: "2",
    slug: "winter-skate-bbr",
    name: "Winter Skate BBR",
    price: 123_456,
    image: "/images/products/winter/winter-jacket-white.jpg",
    imagePosition: "object-[60%_35%]",
    colors: defaultColors,
  },
  {
    id: "3",
    slug: "winter-glass-bbr",
    name: "Winter Glass BBR",
    price: 123_456,
    image: "/images/products/winter/winter-puffer-jacket.jpg",
    imagePosition: "object-[45%_40%]",
    colors: defaultColors,
  },
  {
    id: "4",
    slug: "winter-jacket-v2-bbr",
    name: "Winter Jacket V.2 BBR",
    price: 123_456,
    image: "/images/products/winter/winter-ski-set.jpg",
    imagePosition: "object-[55%_30%]",
    colors: defaultColors,
  },
  {
    id: "5",
    slug: "winter-glove-bbr",
    name: "Winter Glove BBR",
    price: 123_456,
    image: "/images/products/winter/winter-snowboard-kit.jpg",
    imagePosition: "object-[50%_45%]",
    colors: defaultColors,
  },
];
