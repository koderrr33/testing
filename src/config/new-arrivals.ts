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
    slug: "yourproduct",
    name: "yourproduct",
    price: 123_456,
    image: "/images/products/winter/winter-goggles-pro.webp",
    imagePosition: "object-[50%_20%]",
    colors: defaultColors,
  },
  {
    id: "2",
    slug: "yourproduct",
    name: "yourproduct",
    price: 123_456,
    image: "/images/products/winter/winter-jacket-white.webp",
    imagePosition: "object-[60%_35%]",
    colors: defaultColors,
  },
  {
    id: "3",
    slug: "yourproduct",
    name: "yourproduct",
    price: 123_456,
    image: "/images/products/winter/winter-puffer-jacket.webp",
    imagePosition: "object-[45%_40%]",
    colors: defaultColors,
  },
  {
    id: "4",
    slug: "yourproduct",
    name: "yourproduct",
    price: 123_456,
    image: "/images/products/winter/winter-ski-set.webp",
    imagePosition: "object-[55%_30%]",
    colors: defaultColors,
  },
  {
    id: "5",
    slug: "yourproduct",
    name: "yourproduct",
    price: 123_456,
    image: "/images/products/winter/winter-snowboard-kit.webp",
    imagePosition: "object-[50%_45%]",
    colors: defaultColors,
  },
];
