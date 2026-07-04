import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { ProductDetail } from "@/components/shop/product-detail";
import { YouMayLike } from "@/components/shop/you-may-like";
import { getRelatedProducts, products } from "@/lib/products";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return { title: "Product" };
  return { title: product.name };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const relatedProducts = getRelatedProducts(slug);

  return (
    <main className="min-h-screen bg-white">
      <Navbar variant="solid" layout="shop" />
      <div className="pt-[var(--navbar-height)] md:pt-[var(--navbar-height-md)]">
        <ProductDetail product={product} />
        <YouMayLike products={relatedProducts} />
      </div>
    </main>
  );
}
