"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type FavoriteItem = {
  id: string;
  slug: string;
  title: string;
  priceCents: number;
  compareAtCents: number | null;
  image: string | null;
  category: string;
  dealExpiresAt: string | null;
};

type FavoritesContextType = {
  items: FavoriteItem[];
  ids: Set<string>;
  toggle: (item: FavoriteItem) => void;
  remove: (id: string) => void;
  isFavorite: (id: string) => boolean;
  count: number;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);
const STORAGE_KEY = "nuvo_favorites_v1";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, hydrated]);

  function toggle(item: FavoriteItem) {
    setItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [item, ...prev],
    );
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const ids = new Set(items.map((i) => i.id));

  return (
    <FavoritesContext.Provider
      value={{
        items,
        ids,
        toggle,
        remove,
        isFavorite: (id) => ids.has(id),
        count: items.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextType {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
