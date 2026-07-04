 import { CartProvider } from "@/components/cart/cart-provider";
import { CartShell } from "@/components/cart/cart-shell";
import { SiteFooter } from "@/components/layout/site-footer";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      {children}
      <SiteFooter />
      <CartShell />
    </CartProvider>
  );
}
