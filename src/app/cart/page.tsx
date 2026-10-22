"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalCents } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="text-6xl">🛒</div>
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-slate-500">
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
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4"
            >
              <div className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-xl bg-slate-100 text-3xl">
                {item.emoji}
              </div>
              <div className="flex-1">
                <Link
                  href={`/products/${item.slug}`}
                  className="font-semibold hover:text-brand-600"
                >
                  {item.title}
                </Link>
                <div className="mt-1 text-sm text-slate-500">
                  {formatPrice(item.priceCents, item.currency)} each
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="h-8 w-8 rounded-lg border border-slate-300 text-lg leading-none hover:bg-slate-50"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="h-8 w-8 rounded-lg border border-slate-300 text-lg leading-none hover:bg-slate-50"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <div className="w-20 text-right font-semibold">
                {formatPrice(item.priceCents * item.quantity, item.currency)}
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="ml-2 text-slate-400 hover:text-red-500"
                aria-label="Remove item"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold">Order summary</h2>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span>{formatPrice(totalCents)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-slate-500">Shipping</span>
            <span className="text-emerald-600">Free</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(totalCents)}</span>
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
