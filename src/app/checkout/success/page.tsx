import Link from "next/link";

export const metadata = { title: "Order confirmed — Dropshipro" };

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="text-6xl">🎉</div>
      <h1 className="mt-4 text-3xl font-bold">Thank you for your order!</h1>
      <p className="mt-3 text-slate-600">
        Your payment was successful. You&apos;ll receive a confirmation email
        with tracking details once your order ships.
      </p>
      <Link
        href="/products"
        className="mt-8 inline-block rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
      >
        Continue shopping
      </Link>
    </div>
  );
}
