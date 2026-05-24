"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: "hoodie-reality",
    src: "/images/124.jpeg",
    alt: "888balens hand-painted hoodie on white bedding",
  },
  {
    id: "hoodie-alt",
    src: "/images/hd.png",
    alt: "888balens limited drop streetwear",
  },
] as const;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }, []);

  const slide = slides[index];

  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-[#f5f3ef]">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id + index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 p-2 text-black/70 transition-colors hover:text-black md:left-6"
      >
        <ChevronLeft className="h-5 w-5 stroke-[1.25]" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 p-2 text-black/70 transition-colors hover:text-black md:right-6"
      >
        <ChevronRight className="h-5 w-5 stroke-[1.25]" />
      </button>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
              "h-[2px] w-8 transition-all",
              i === index ? "bg-black" : "bg-black/25",
            )}
          />
        ))}
      </div>
    </section>
  );
}
