import Image from "next/image";

export function ShopBanner() {
  return (
    <section className="relative w-full bg-[#f5f3ef]">
      <div className="relative aspect-[21/7] min-h-[200px] w-full sm:min-h-[260px] md:min-h-[320px] lg:min-h-[380px]">
        <Image
          src="/images/hd.png"
          alt="888balens product banner — hand-painted streetwear"
          fill
          priority
          className="object-cover object-[center_35%]"
          sizes="100vw"
        />
      </div>
    </section>
  );
}
