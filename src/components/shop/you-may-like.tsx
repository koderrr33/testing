import Image from "next/image";
import Link from "next/link";
import { formatIdr } from "@/lib/format";
import type { Product } from "@/lib/products";

type YouMayLikeProps = {
  products: Product[];
};

export function YouMayLike({ products }: YouMayLikeProps) {
  if (products.length === 0) return null;
  return (
    <section className="border-t border-black/8 bg-white px-4 py-8 sm:px-6 md:px-10 md:py-10 lg:px-14">
      <h2 className="mb-4 text-[11px] font-bold tracking-[0.18em] text-black uppercase sm:mb-5 sm:text-xs">
        You may like
      </h2>
      <div className="grid w-full grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 md:gap-5 lg:grid-cols-6 xl:grid-cols-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/shop/${product.slug}`}
            className="group block"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-white">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain object-center transition-opacity duration-300 group-hover:opacity-80"
                sizes="(max-width: 640px) 30vw, (max-width: 768px) 22vw, (max-width: 1024px) 18vw, 200px"
              />
            </div>
            <div className="mt-2 space-y-0.5 sm:mt-2">
              <p className="truncate text-[10px] font-bold tracking-[0.08em] text-black uppercase sm:text-[11px] md:text-xs">
                {product.name}
              </p>
              <p className="text-[10px] font-medium text-black/55 sm:text-[11px] md:text-xs">
                {formatIdr(product.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}