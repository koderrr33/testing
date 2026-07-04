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

      <div className="grid w-full max-w-md grid-cols-3 gap-3 sm:max-w-lg sm:gap-4 md:max-w-xl">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/shop/${product.slug}`}
            className="group block"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-white">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain object-center transition-opacity duration-300 group-hover:opacity-80"
                sizes="(max-width: 640px) 28vw, 160px"
              />
            </div>
            <div className="mt-2 space-y-0.5">
              <p className="truncate text-[10px] font-bold tracking-[0.1em] text-black uppercase sm:text-[11px]">
                {product.name}
              </p>
              <p className="text-[10px] font-medium text-black/55 sm:text-[11px]">
                {formatIdr(product.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
