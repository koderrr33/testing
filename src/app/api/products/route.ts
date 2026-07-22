import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/products/db";

export async function GET() {
  const products = await getAllProducts();
  const mapped = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    image: p.image,
    category: p.category,
    description: p.description ?? "",
    badge: p.badge ?? null,
  }));
  return NextResponse.json(mapped);
}
