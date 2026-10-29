"use client";

import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";
import { isOnSale } from "@/lib/products";
import { discountPercent } from "@/lib/format";
import ProductImage from "@/components/ProductImage";
import Price from "@/components/Price";
import Countdown from "@/components/Countdown";
import FavoriteButton from "@/components/FavoriteButton";

export default function FavoritesPage() {
  const { items } = useFavorites();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-rose-50 text-rose-500 dark:bg-slate-800">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
            <path d="M12 21s-7.5-4.6-10-9.3A5.2 5.2 0 0112 6a5.2 5.2 0 0110 5.7C19.5 16.4 12 21 12 21z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold">No favorites yet</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Tap the heart on any product to save it here.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold">Your favorites</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        {items.length} saved {items.length === 1 ? "item" : "items"}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
        {items.map((p) => {
          const onSale = isOnSale(p);
          const pct =
            onSale && p.compareAtCents
              ? discountPercent(p.priceCents, p.compareAtCents)
              : 0;
          return (
            <Link
              key={p.id}
              href={`/products/${p.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="relative h-44 overflow-hidden">
                <ProductImage image={p.image} title={p.title} category={p.category} className="transition duration-300 group-hover:scale-105" />
                {onSale && pct > 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-rose-600 px-2 py-0.5 text-xs font-bold text-white">
                    -{pct}%
                  </span>
                )}
                <div className="absolute right-2 top-2">
                  <FavoriteButton item={p} />
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <span className="text-xs font-medium uppercase tracking-wide text-brand-600 dark:text-brand-200">
                  {p.category}
                </span>
                <h3 className="mt-1 line-clamp-2 flex-1 text-sm font-semibold leading-snug">
                  {p.title}
                </h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <Price cents={p.priceCents} className="text-lg font-bold" />
                  {onSale && p.compareAtCents && (
                    <Price cents={p.compareAtCents} className="text-sm text-slate-400 line-through" />
                  )}
                </div>
                {onSale && p.dealExpiresAt && (
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <span>Ends in</span>
                    <Countdown expiresAt={p.dealExpiresAt} compact />
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
