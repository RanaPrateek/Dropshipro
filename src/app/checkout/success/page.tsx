import Link from "next/link";

export const metadata = { title: "Order confirmed — Nuvo" };

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const orderNumber = searchParams.order;

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="mt-5 text-3xl font-bold">Thank you for your order!</h1>
      {orderNumber && (
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Your order number is{" "}
          <strong className="font-mono">{orderNumber}</strong>. We&apos;ve
          emailed you a confirmation.
        </p>
      )}
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        You&apos;ll get tracking details by email once it ships.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        {orderNumber && (
          <Link
            href={`/track?order=${orderNumber}`}
            className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
          >
            Track my order
          </Link>
        )}
        <Link
          href="/products"
          className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
