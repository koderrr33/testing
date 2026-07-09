import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/lib/products";
import { formatIdr } from "@/lib/format";

type NewArrivalCardProps = {
  product: Product;
};

export function NewArrivalCard({ product }: NewArrivalCardProps) {
  return (
    <article className="group flex w-full shrink-0 flex-col">
      <Link
        href={`/shop/${product.slug}`}
        className="block"
        aria-label={product.name}
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-neutral-100 sm:rounded-lg">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover ${product.imagePosition} saturate-0 contrast-[1.08] brightness-[0.97] transition-transform duration-500 group-hover:scale-[1.02]`}
            sizes="(max-width: 768px) 72vw, 20vw"
          />
        </div>

        <div className="mt-3 space-y-1.5 sm:mt-4">
          <p className="text-[11px] font-semibold tracking-[0.02em] text-black sm:text-xs">
            {product.name}
          </p>
          <p className="text-[10px] text-neutral-400 sm:text-[11px]">
            {formatIdr(product.price)}
          </p>
          <ul className="flex items-center gap-1.5 pt-0.5" aria-label="Color options">
            {(product.colors ?? []).map((color) => (
              <li key={color.id}>
                <span
                  className={`block size-2.5 rounded-[2px] sm:size-3 ${color.className}`}
                  title={color.label}
                />
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </article>
  );
}
