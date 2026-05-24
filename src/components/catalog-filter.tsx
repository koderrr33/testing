"use client";

import { motion } from "framer-motion";
import {
  categoryFilters,
  sizeFilters,
  type FilterCategory,
  type FilterSize,
} from "@/lib/products";
import { cn } from "@/lib/utils";

type CatalogFilterProps = {
  category: FilterCategory;
  size: FilterSize;
  onCategoryChange: (value: FilterCategory) => void;
  onSizeChange: (value: FilterSize) => void;
};

function FilterPill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "shrink-0 rounded-full border px-4 py-1.5 text-[11px] font-semibold tracking-wide transition-colors md:px-5 md:py-2 md:text-xs",
        active
          ? "border-black bg-black text-white"
          : "border-black/30 bg-white text-black hover:border-black/60",
      )}
    >
      {label}
    </motion.button>
  );
}

export function CatalogFilter({
  category,
  size,
  onCategoryChange,
  onSizeChange,
}: CatalogFilterProps) {
  return (
    <div className="border-y border-black/10 bg-white">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:gap-6 md:px-10 md:py-6 lg:px-14">
        <span className="shrink-0 text-xs font-bold tracking-[0.2em] text-black md:text-sm">
          FILTER
        </span>
        <div className="flex flex-1 gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categoryFilters.map((item) => (
            <FilterPill
              key={item.value}
              label={item.label}
              active={category === item.value}
              onClick={() => {
                onCategoryChange(item.value);
                if (item.value !== "all") onSizeChange("all");
              }}
            />
          ))}
          <span className="mx-1 w-px shrink-0 self-stretch bg-black/10" />
          {sizeFilters.map((item) => (
            <FilterPill
              key={item.value}
              label={item.label}
              active={size === item.value}
              onClick={() =>
                onSizeChange(size === item.value ? "all" : item.value)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
