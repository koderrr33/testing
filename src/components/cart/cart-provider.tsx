"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getCartItemId,
  type CartItem,
} from "@/lib/cart/types";
import type { DisplaySize } from "@/lib/products/types";

const STORAGE_KEY = "yourbrand-cart";

type AddToCartInput = {
  productSlug: string;
  productName: string;
  size: DisplaySize;
  price: number;
  image: string;
  quantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isCartOpen: boolean;
  addedItem: CartItem | null;
  addItem: (input: AddToCartInput) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  dismissAddedToast: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedItem, setAddedItem] = useState<CartItem | null>(null);

  useEffect(() => {
    const stored = readStoredItems();
    if (stored.length > 0) {
      setItems(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((input: AddToCartInput) => {
    const qty = input.quantity ?? 1;
    const id = getCartItemId(input.productSlug, input.size);

    setItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        const updated = prev.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.min(item.quantity + qty, 10) }
            : item,
        );
        const next = updated.find((item) => item.id === id)!;
        setAddedItem(next);
        return updated;
      }

      const next: CartItem = {
        id,
        productSlug: input.productSlug,
        productName: input.productName,
        size: input.size,
        quantity: qty,
        price: input.price,
        image: input.image,
      };
      setAddedItem(next);
      return [...prev, next];
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(quantity, 10) } : item,
      ),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
      isCartOpen,
      addedItem,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      dismissAddedToast: () => setAddedItem(null),
    }),
    [
      items,
      isCartOpen,
      addedItem,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
