import Link from "next/link";

export const metadata = { title: "Favorites — Nuvo" };

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="text-5xl">♡</div>
      <h1 className="mt-4 text-2xl font-bold">Favorites are coming soon</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Soon you&apos;ll be able to save products you love and find them here.
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
