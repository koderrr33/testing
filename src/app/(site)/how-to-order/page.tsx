import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "How to Order",
};

export default function HowToOrderPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] pb-20 text-[#faf9f7] md:pb-0">
      <SiteHeader variant="solid" />
      <div className="mx-auto max-w-2xl px-5 pt-28 md:px-10 md:pt-32">
        <p className="text-[11px] font-semibold tracking-[0.25em] text-brand-gold">
          HOW TO ORDER
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-logo)] text-5xl text-white md:text-6xl">
          Custom &amp; limited drops
        </h1>
        <ol className="mt-10 space-y-6 text-sm leading-relaxed text-white/75 md:text-base">
          <li>
            <span className="font-semibold text-white">01 — Pick your piece</span>
            <br />
            Browse the shop or DM us for a fully custom hand-painted order.
          </li>
          <li>
            <span className="font-semibold text-white">02 — Confirm size &amp; details</span>
            <br />
            We&apos;ll confirm availability, sizing, and artwork direction.
          </li>
          <li>
            <span className="font-semibold text-white">03 — Pay &amp; production</span>
            <br />
            Payment via Midtrans. Each piece is painted to order — allow production time.
          </li>
        </ol>
        <Link
          href="/shop"
          className="mt-12 inline-block border border-white/30 px-8 py-3 text-[11px] font-semibold tracking-[0.2em] transition-colors hover:border-white hover:bg-white hover:text-black"
        >
          VIEW CATALOG
        </Link>
      </div>
    </main>
  );
}
