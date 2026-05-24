"use client";

import { useMemo, useState } from "react";
import { CatalogFilter } from "@/components/catalog-filter";
import { ProductCard } from "@/components/product-card";
import {
  products,
  type FilterCategory,
  type FilterSize,
} from "@/lib/products";

export function ProductGrid() {
  const [category, setCategory] = useState<FilterCategory>("all");
  const [size, setSize] = useState<FilterSize>("all");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory =
        category === "all" || p.category === category;
      const matchSize = size === "all" || p.sizes.includes(size);
      return matchCategory && matchSize;
    });
  }, [category, size]);

  return (
    <>
      <CatalogFilter
        category={category}
        size={size}
        onCategoryChange={setCategory}
        onSizeChange={setSize}
      />

      <section className="bg-white px-5 py-8 md:px-10 md:py-10 lg:px-14">
        <h2 className="mb-6 text-[11px] font-semibold tracking-[0.25em] text-black md:mb-8 md:text-xs">
          ALL PRODUCT
        </h2>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-black/50">
            No pieces match this filter. Try another category or size.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6 lg:gap-4">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
