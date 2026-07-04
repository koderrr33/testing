import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { markOrderCancelledIfPending } from "@/actions/checkout";
import { CartCheckoutForm } from "@/components/checkout/cart-checkout-form";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Navbar } from "@/components/layout/navbar";
import {
  displaySizes,
  getProductBySlug,
  isSizeAvailable,
  type DisplaySize,
} from "@/lib/products";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{
    slug?: string;
    size?: string;
    qty?: string;
    from?: string;
    failed?: string;
    order?: string;
  }>;
};

function parseSize(size: string | undefined): DisplaySize | undefined {
  if (!size) return undefined;
  return displaySizes.includes(size as DisplaySize)
    ? (size as DisplaySize)
    : undefined;
}

function parseQty(qty: string | undefined): number {
  const n = Number(qty);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(Math.floor(n), 10);
}

export default async function CheckoutPage({ searchParams }: Props) {
  const { slug, size: sizeParam, qty, from, failed, order: orderId } =
    await searchParams;
  const showPaymentFailed = failed === "1";

  if (showPaymentFailed && orderId) {
    await markOrderCancelledIfPending(orderId);
  }

  if (from === "cart") {
    return (
      <main className="min-h-screen bg-white">
        <Navbar variant="solid" layout="shop" />
        <div className="mx-auto max-w-lg px-5 pt-28 pb-20 md:px-10 md:pt-32">
          <p className="text-[11px] font-semibold tracking-[0.25em] text-black/45 uppercase">
            Checkout
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-black lowercase">
            selesaikan order lo
          </h1>
          <div className="mt-10">
            <CartCheckoutForm showPaymentFailed={showPaymentFailed} />
          </div>
        </div>
      </main>
    );
  }

  if (!slug) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar variant="solid" layout="shop" />
        <div className="mx-auto max-w-lg px-5 pt-28 pb-20 md:px-10 md:pt-32">
          <p className="text-[11px] font-semibold tracking-[0.25em] text-black/45 uppercase">
            Checkout
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-black">
            Pilih produk dulu
          </h1>
          <p className="mt-3 text-sm text-black/55">
            Belum ada item di checkout. Mulai dari katalog shop.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex h-11 items-center rounded-md bg-black px-6 text-sm font-medium text-white lowercase"
          >
            ke shop
          </Link>
        </div>
      </main>
    );
  }

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const requestedSize = parseSize(sizeParam);
  const defaultSize =
    requestedSize && isSizeAvailable(product, requestedSize)
      ? requestedSize
      : (displaySizes.find((s) => isSizeAvailable(product, s)) ?? "M");

  const defaultQty = parseQty(qty);

  return (
    <main className="min-h-screen bg-white">
      <Navbar variant="solid" layout="shop" />
      <div className="mx-auto max-w-lg px-5 pt-28 pb-20 md:px-10 md:pt-32">
        <p className="text-[11px] font-semibold tracking-[0.25em] text-black/45 uppercase">
          Checkout
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-black lowercase">
          selesaikan order lo
        </h1>

        <div className="mt-10">
          <CheckoutForm
            product={product}
            initialSize={defaultSize}
            initialQuantity={defaultQty}
            showPaymentFailed={showPaymentFailed}
          />
        </div>
      </div>
    </main>
  );
}
