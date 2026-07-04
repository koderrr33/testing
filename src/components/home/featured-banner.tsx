import { featuredBannerPanels } from "@/config/assets";
import Image from "next/image";
import Link from "next/link";

const panels = featuredBannerPanels;

function ShopNowButton() {
  return (
    <span className="inline-block border border-white px-5 py-2 text-[11px] tracking-[0.2em] text-white uppercase transition-colors duration-200 group-hover:bg-white group-hover:text-black">
      SHOP NOW
    </span>
  );
}

export function FeaturedBanner() {
  return (
    <section className="shrink-0 bg-white px-4 pb-8 sm:px-6 sm:pb-10 md:px-[75px] md:pb-14">
      <div className="grid min-h-[220px] grid-cols-1 gap-3 sm:min-h-[280px] md:min-h-[360px] md:grid-cols-[1fr_3fr] md:gap-4 lg:min-h-[420px]">
        {panels.map((panel) => (
          <div
            key={panel.id}
            className="group relative block h-full min-h-[220px] overflow-hidden bg-black sm:min-h-[280px] md:min-h-0"
          >
            <Image
              src={panel.src}
              alt={panel.alt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 75vw"
            />
            <div
              className={`absolute inset-x-0 bottom-5 flex px-6 md:bottom-6 md:px-8 ${
                panel.buttonAlign === "left" ? "justify-start" : "justify-center"
              }`}
            >
              <Link href={panel.href} className="relative z-10">
                <ShopNowButton />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
