import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { products } from "@/lib/products";

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

  return (
    <main className="min-h-screen bg-white pb-20 md:pb-0">
      <SiteHeader variant="solid" />
      <div className="mx-auto grid max-w-[1600px] gap-8 px-5 pt-24 md:grid-cols-2 md:gap-12 md:px-10 md:pt-28 lg:px-14">
        <div className="relative aspect-[3/4] border border-black/20 bg-[#faf9f7]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="flex flex-col justify-center py-4">
          <p className="text-[11px] font-semibold tracking-[0.25em] text-black/50 uppercase">
            {product.category}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-black md:text-3xl">
            {product.name}
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-black/60">
            Hand-painted limited piece. Sizes: {product.sizes.join(", ")}.
            Each drop is unique — no two paints exactly alike.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {product.sizes.map((s) => (
              <span
                key={s}
                className="rounded-full border border-black/30 px-4 py-2 text-xs font-semibold"
              >
                {s}
              </span>
            ))}
          </div>
          <button
            type="button"
            className="mt-10 w-full max-w-xs bg-black py-3.5 text-[11px] font-semibold tracking-[0.2em] text-white transition-opacity hover:opacity-85 md:w-auto md:px-12"
          >
            ADD TO CART
          </button>
          <Link
            href="/shop"
            className="mt-6 text-[11px] font-semibold tracking-[0.15em] text-black/50 underline-offset-4 hover:underline"
          >
            ← BACK TO SHOP
          </Link>
        </div>
      </div>
    </main>
  );
}
