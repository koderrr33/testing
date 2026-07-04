"use client";

import Image from "next/image";
import { heroSlides } from "@/config/assets";

const slide = heroSlides[0];

export function HeroCarousel() {
  return (
    <section
      aria-label="Hero"
      className="relative h-[110svh] min-h-[100svh] w-full shrink-0 snap-start snap-always overflow-hidden bg-white"
    >
      <Image
        src={slide.src}
        alt={slide.alt}
        fill
        priority
        className="object-cover object-[40%_35%] contrast-[1.14] brightness-[1.00] saturate-10 sm:object-[45%_40%] md:object-[50%_45%] lg:object-[55%_50%]"
        sizes="100vw"
        quality={90}
      />
    </section>
  );
}
