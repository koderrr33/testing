"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatIdr } from "@/lib/format";
import type { Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
  index?: number;
  variant?: "default" | "catalog";
};

export function ProductCard({
  product,
  index = 0,
  variant = "default",
}: ProductCardProps) {
  const isCatalog = variant === "catalog";

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
      className="group"
    >
      <Link href={`/shop/${product.slug}`} className="block">
        <div
          className={
            isCatalog
              ? "relative aspect-[4/5] overflow-hidden rounded-3xl bg-neutral-200 transition-opacity group-hover:opacity-90"
              : "relative aspect-[3/4] overflow-hidden bg-white transition-opacity group-hover:opacity-90"
          }
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={
              isCatalog
                ? "object-cover object-center grayscale contrast-110 transition-transform duration-500 group-hover:scale-[1.04]"
                : "object-contain object-center p-2 transition-transform duration-500 group-hover:scale-[1.02]"
            }
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />

          {isCatalog && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-3xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-4xl">
                  New
                </p>
                <p className="text-3xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-4xl">
                  {product.name}
                </p>
              </div>
            </>
          )}
        </div>

        {!isCatalog && (
          <div className="mt-3 space-y-0.5">
            <p className="text-[11px] font-bold tracking-[0.12em] text-black uppercase">
              {product.name}
            </p>
            <p className="text-[11px] font-medium text-black/55">
              {formatIdr(product.price)}
            </p>
          </div>
        )}
      </Link>
    </motion.article>
  );
}