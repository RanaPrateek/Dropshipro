"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import ProductImage from "@/components/ProductImage";
import Price from "@/components/Price";
import Countdown from "@/components/Countdown";

function onSale(item: { priceCents: number; compareAtCents?: number | null; dealExpiresAt?: string | null }) {
  if (item.compareAtCents == null || item.compareAtCents <= item.priceCents) return false;
  if (item.dealExpiresAt && new Date(item.dealExpiresAt).getTime() <= Date.now()) return false;
  return true;
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalCents } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="text-6xl">🛒</div>
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold">Your cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="space-y-4">
          {items.map((item) => {
            const deal = onSale(item);
            return (
              <li
                key={item.lineId}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
              >
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
                  <ProductImage
                    image={item.image}
                    title={item.title}
                    category={item.category}
                    compact
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${item.slug}`}
                    className="line-clamp-2 text-sm font-semibold leading-snug hover:text-brand-600"
                  >
                    {item.title}
                  </Link>
                  {(item.color || item.size) && (
                    <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {[item.color, item.size].filter(Boolean).join(" · ")}
                    </div>
                  )}
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <Price cents={item.priceCents} className="text-slate-600 dark:text-slate-300" />
                    {deal && item.compareAtCents && (
                      <Price
                        cents={item.compareAtCents}
                        className="text-xs text-slate-400 line-through"
                      />
                    )}
                  </div>
                  {deal && item.dealExpiresAt && (
                    <div className="mt-1 text-xs">
                      <Countdown expiresAt={item.dealExpiresAt} compact /> — buy
                      before the deal ends!
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                    className="h-8 w-8 rounded-lg border border-slate-300 text-lg leading-none hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                    className="h-8 w-8 rounded-lg border border-slate-300 text-lg leading-none hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <div className="w-20 text-right font-semibold">
                  <Price cents={item.priceCents * item.quantity} />
                </div>
                <button
                  onClick={() => removeItem(item.lineId)}
                  className="ml-2 text-slate-400 hover:text-red-500"
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
          <h2 className="font-semibold">Order summary</h2>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
            <Price cents={totalCents} />
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Shipping</span>
            <span className="text-emerald-600">Free</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-lg font-bold dark:border-slate-700">
            <span>Total</span>
            <Price cents={totalCents} />
          </div>
          <Link
            href="/checkout"
            className="mt-6 block rounded-xl bg-brand-600 px-6 py-3 text-center font-semibold text-white hover:bg-brand-700"
          >
            Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
