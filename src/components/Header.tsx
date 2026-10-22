"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
            D
          </span>
          <span>
            Drop<span className="text-brand-600">shipro</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/products" className="hover:text-brand-600">
            Shop
          </Link>
          <Link
            href="/cart"
            className="relative rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
          >
            Cart
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-brand-500 text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
