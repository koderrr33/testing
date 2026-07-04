import { HeroCarousel } from "@/components/home/hero-carousel";
import { HomeScrollSnap } from "@/components/home/home-scroll-snap";
import { NewArrivals } from "@/components/home/new-arrivals";
import { Navbar } from "@/components/layout/navbar";

export default function HomePage() {
  return (
    <main className="relative bg-white">
      <HomeScrollSnap />
      <Navbar variant="transparent" layout="hero" />
      <HeroCarousel />
      <div className="relative flex min-h-[100svh] snap-start snap-always flex-col bg-white">
        <NewArrivals />
      </div>
    </main>
  );
}
