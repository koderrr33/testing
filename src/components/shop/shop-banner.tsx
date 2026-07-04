import { shopBannerImage } from "@/config/assets";
import Image from "next/image";

export function ShopBanner() {
  return (
    <section className="relative w-full bg-black">
      <div className="relative aspect-[16/9] min-h-[160px] w-full sm:aspect-[21/8] sm:min-h-[220px] md:min-h-[340px] lg:min-h-[400px]">
        <Image
          src={shopBannerImage.src}
          alt={shopBannerImage.alt}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
    </section>
  );
}
