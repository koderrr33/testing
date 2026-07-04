"use client";

import { CartAddedToast } from "@/components/cart/cart-added-toast";
import { CartModal } from "@/components/cart/cart-modal";

export function CartShell() {
  return (
    <>
      <CartAddedToast />
      <CartModal />
    </>
  );
}
