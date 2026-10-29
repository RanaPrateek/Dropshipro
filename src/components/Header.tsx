"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCustomer } from "@/context/CustomerContext";
import { useFavorites } from "@/context/FavoritesContext";
import { CATEGORIES } from "@/lib/products";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import CurrencySwitcher from "./CurrencySwitcher";

function Icon({ path, label }: { path: string; label: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-label={label}
    >
      <path d={path} />
    </svg>
  );
}

const ICONS = {
  search: "M21 21l-4.3-4.3M11 19a8 8 0 100-16 8 8 0 000 16z",
  heart:
    "M12 21s-7.5-4.6-10-9.3A5.2 5.2 0 0112 6a5.2 5.2 0 0110 5.7C19.5 16.4 12 21 12 21z",
  user: "M20 21a8 8 0 10-16 0M12 11a4 4 0 100-8 4 4 0 000 8z",
  cart: "M6 6h15l-1.5 9h-12L5 3H2M9 20a1 1 0 100 2 1 1 0 000-2zm9 0a1 1 0 100 2 1 1 0 000-2z",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M6 6l12 12M18 6L6 18",
};

export default function Header() {
  const router = useRouter();
  const { totalItems } = useCart();
  const { customer, loading, openAuth } = useCustomer();
  const { count: favCount } = useFavorites();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    setMenuOpen(false);
  }

  const iconBtn =
    "grid h-9 w-9 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      {/* top utility bar */}
      <div className="border-b border-slate-100 bg-slate-50 text-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
          <span className="text-slate-500 dark:text-slate-400">
            ✨ Free tracked shipping on orders over $50
          </span>
          <div className="flex items-center gap-2">
            <CurrencySwitcher />
            {loading ? (
              <span className="w-20" />
            ) : customer ? (
              <Link
                href="/account"
                className="font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300"
              >
                Hi, {customer.name?.split(" ")[0] || "account"}
              </Link>
            ) : (
              <button
                onClick={openAuth}
                className="font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300"
              >
                Sign in / Register
              </button>
            )}
            <ThemeToggle className="h-7 w-7 text-sm" />
          </div>
        </div>
      </div>

      {/* main nav */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        {/* left: categories (desktop) + hamburger (mobile) */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className={`${iconBtn} md:hidden`}
            aria-label="Menu"
          >
            <Icon path={menuOpen ? ICONS.close : ICONS.menu} label="Menu" />
          </button>
          <nav className="hidden items-center gap-1 md:flex">
            {CATEGORIES.map((c) => (
              <div key={c} className="group relative">
                <Link
                  href={`/products?category=${encodeURIComponent(c)}`}
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition group-hover:bg-brand-50 group-hover:text-brand-700 dark:text-slate-200 dark:group-hover:bg-slate-800 dark:group-hover:text-white"
                >
                  {c}
                </Link>
                {/* hover dropdown */}
                <div className="invisible absolute left-0 top-full z-40 w-48 translate-y-1 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:border-slate-800 dark:bg-slate-900">
                  <Link
                    href={`/products?category=${encodeURIComponent(c)}`}
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Shop all {c}
                  </Link>
                  <Link
                    href="/#deals"
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    On sale
                  </Link>
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* center: logo */}
        <Link href="/" aria-label="Nuvo home" className="shrink-0">
          <Logo />
        </Link>

        {/* right: search + icons */}
        <div className="flex items-center gap-1">
          <form
            onSubmit={submitSearch}
            className="hidden items-center rounded-full border border-slate-300 px-3 py-1.5 focus-within:border-brand-500 dark:border-slate-700 lg:flex"
          >
            <span className="text-slate-400">
              <Icon path={ICONS.search} label="Search" />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="ml-2 w-40 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </form>
          <Link href="/favorites" className={`${iconBtn} relative`} aria-label="Favorites">
            <Icon path={ICONS.heart} label="Favorites" />
            {favCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {favCount}
              </span>
            )}
          </Link>
          <Link href="/account" className={`${iconBtn} hidden sm:grid`} aria-label="Profile">
            <Icon path={ICONS.user} label="Profile" />
          </Link>
          <Link href="/cart" className={`${iconBtn} relative`} aria-label="Cart">
            <Icon path={ICONS.cart} label="Cart" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div className="border-t border-slate-200 px-4 py-3 md:hidden dark:border-slate-800">
          <form onSubmit={submitSearch} className="mb-3 flex items-center rounded-full border border-slate-300 px-3 py-2 dark:border-slate-700">
            <span className="text-slate-400">
              <Icon path={ICONS.search} label="Search" />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </form>
          <nav className="flex flex-col">
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/products?category=${encodeURIComponent(c)}`}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {c}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
