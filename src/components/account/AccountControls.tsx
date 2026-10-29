"use client";

import { useRouter } from "next/navigation";
import { useCustomer } from "@/context/CustomerContext";

export function SignedOutPrompt() {
  const { openAuth } = useCustomer();
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-slate-800">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
          <path d="M20 21a8 8 0 10-16 0M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="mt-4 text-2xl font-bold">Your account</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Sign in or create an account to see your orders and saved items.
      </p>
      <button
        onClick={openAuth}
        className="mt-6 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
      >
        Sign in / Register
      </button>
    </div>
  );
}

export function SignOutButton() {
  const router = useRouter();
  const { logout } = useCustomer();
  async function handle() {
    await logout();
    router.push("/");
    router.refresh();
  }
  return (
    <button
      onClick={handle}
      className="text-sm font-medium text-slate-500 hover:text-red-500"
    >
      Sign out
    </button>
  );
}
