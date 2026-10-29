"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  lineId: string; // unique per product+color+size combination
  productId: string;
  slug: string;
  title: string;
  priceCents: number;
  compareAtCents?: number | null;
  dealExpiresAt?: string | null;
  currency: string;
  image: string | null;
  category: string;
  color?: string;
  size?: string;
  quantity: number;
};

export type AddItemInput = Omit<CartItem, "lineId" | "quantity">;

type CartContextType = {
  items: CartItem[];
  addItem: (item: AddItemInput, quantity?: number) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  totalCents: number;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "dropshipro_cart_v2";

function makeLineId(productId: string, color?: string, size?: string): string {
  return `${productId}|${color ?? ""}|${size ?? ""}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore unavailable/corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage write failures
    }
  }, [items, hydrated]);

  function addItem(item: AddItemInput, quantity = 1) {
    const lineId = makeLineId(item.productId, item.color, item.size);
    setItems((prev) => {
      const existing = prev.find((i) => i.lineId === lineId);
      if (existing) {
        return prev.map((i) =>
          i.lineId === lineId ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [...prev, { ...item, lineId, quantity }];
    });
  }

  function removeItem(lineId: string) {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  }

  function updateQuantity(lineId: string, quantity: number) {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.lineId !== lineId)
        : prev.map((i) => (i.lineId === lineId ? { ...i, quantity } : i)),
    );
  }

  function clear() {
    setItems([]);
  }

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );
  const totalCents = useMemo(
    () => items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0),
    [items],
  );

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    totalItems,
    totalCents,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
