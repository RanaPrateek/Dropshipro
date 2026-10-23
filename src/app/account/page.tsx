import Link from "next/link";

export const metadata = { title: "Account — Nuvo" };

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="text-5xl">👤</div>
      <h1 className="mt-4 text-2xl font-bold">Accounts are coming soon</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Sign in &amp; register (with email and social login) will be available
        in the next update.
      </p>
      <Link
        href="/products"
        className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
      >
        Continue shopping
      </Link>
    </div>
  );
}
