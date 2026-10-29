import Link from "next/link";
import Logo from "./Logo";
import PaymentLogos from "./PaymentLogos";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* brand */}
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-slate-500 dark:text-slate-400">
              Curated clothing &amp; electronics, delivered to your door. Quality
              finds without the hassle.
            </p>
          </div>

          {/* customer service */}
          <div>
            <h3 className="text-sm font-semibold">Customer Service</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/track" className="hover:text-brand-600">Track my order</Link></li>
              <li><Link href="/account" className="hover:text-brand-600">Contact us</Link></li>
              <li><Link href="/account" className="hover:text-brand-600">FAQ</Link></li>
              <li><Link href="/account" className="hover:text-brand-600">Shipping info</Link></li>
              <li><Link href="/account" className="hover:text-brand-600">Returns &amp; refunds</Link></li>
            </ul>
          </div>

          {/* pay with */}
          <div>
            <h3 className="text-sm font-semibold">Pay With</h3>
            <div className="mt-3">
              <PaymentLogos />
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Secure checkout powered by Stripe
            </p>
          </div>

          {/* stay connected */}
          <div>
            <h3 className="text-sm font-semibold">Stay Connected</h3>
            <div className="mt-3 flex gap-3 text-slate-500 dark:text-slate-400">
              {["Instagram", "TikTok", "Facebook", "X"].map((s) => (
                <a key={s} href="#" className="text-sm hover:text-brand-600">
                  {s}
                </a>
              ))}
            </div>
            <form className="mt-4">
              <label className="text-xs text-slate-500 dark:text-slate-400">
                Get deals in your inbox
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="email"
                  placeholder="you@email.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Nuvo. All rights reserved.</p>
          <p>Fast shipping · 30-day returns · Secure checkout</p>
        </div>
      </div>
    </footer>
  );
}
