import { HeroCarousel } from "@/components/hero-carousel";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <main className="relative min-h-[100svh] bg-[#f5f3ef] pb-16 md:pb-0">
      <SiteHeader variant="transparent" />
      <HeroCarousel />
    </main>
  );
}
