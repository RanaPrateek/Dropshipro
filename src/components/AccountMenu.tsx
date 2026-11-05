"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomer } from "@/context/CustomerContext";
import CurrencySwitcher from "./CurrencySwitcher";
import ThemeToggle from "./ThemeToggle";

const USER_PATH = "M20 21a8 8 0 10-16 0M12 11a4 4 0 100-8 4 4 0 000 8z";

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d={USER_PATH} />
    </svg>
  );
}

export default function AccountMenu() {
  const router = useRouter();
  const { customer, loading, openAuth, logout } = useCustomer();
  const [open, setOpen] = useState(false);

  async function signOut() {
    setOpen(false);
    await logout();
    router.push("/");
    router.refresh();
  }

  const menuLink =
    "block rounded-lg px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800";
  const rowBase =
    "flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-600 dark:text-slate-300";

  return (
    <div className="relative">
      {/* trigger */}
      {loading ? (
        <span className="grid h-9 w-9 place-items-center text-slate-400">
          <UserIcon />
        </span>
      ) : customer ? (
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 rounded-full px-2 py-1.5 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Account menu"
        >
          <UserIcon />
          <span className="hidden text-sm font-medium sm:inline">
            {customer.name?.split(" ")[0] || "Account"}
          </span>
        </button>
      ) : (
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <UserIcon />
          <span className="hidden sm:inline">Sign in / Register</span>
        </button>
      )}

      {/* dropdown */}
      {open && (
        <>
          <button
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 cursor-default"
          />
          <div className="absolute right-0 top-full z-40 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            {customer ? (
              <>
                <div className="px-3 py-2">
                  <div className="text-sm font-semibold">
                    Hi, {customer.name?.split(" ")[0] || "there"}
                  </div>
                  <div className="truncate text-xs text-slate-400">{customer.email}</div>
                </div>
                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                <Link href="/account" className={menuLink} onClick={() => setOpen(false)}>
                  My account
                </Link>
                <Link href="/account" className={menuLink} onClick={() => setOpen(false)}>
                  Order history
                </Link>
                <Link href="/favorites" className={menuLink} onClick={() => setOpen(false)}>
                  Favorites
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  openAuth();
                }}
                className="w-full rounded-lg bg-brand-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Sign in / Register
              </button>
            )}

            {/* settings: currency + theme (always available) */}
            <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
            <div className={rowBase}>
              <span>Currency</span>
              <CurrencySwitcher />
            </div>
            <div className={rowBase}>
              <span>Theme</span>
              <ThemeToggle />
            </div>

            {customer && (
              <>
                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                <button
                  onClick={signOut}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
