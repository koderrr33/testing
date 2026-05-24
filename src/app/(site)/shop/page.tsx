import type { Metadata } from "next";
import { ProductGrid } from "@/components/product-grid";
import { ShopBanner } from "@/components/shop-banner";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Shop — All Products",
  description: "Browse hoodies, jerseys, and tracktops from 888balens.",
};

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-white pb-20 md:pb-0">
      <SiteHeader variant="solid" />
      <div className="pt-16 md:pt-[72px]">
        <ShopBanner />
        <ProductGrid />
      </div>
    </main>
  );
}
