import Link from "next/link";
import { getCurrentCustomer } from "@/lib/customerAuth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings — Nuvo" };

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        {children}
      </div>
    </section>
  );
}

export default async function SettingsPage() {
  const customer = await getCurrentCustomer();
  if (!customer) return null; // layout guards this

  const row = "flex items-center justify-between gap-4 py-1.5";

  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Your contact details, payment methods, and privacy choices.
      </p>

      <div className="mt-6 space-y-4">
        <Section title="Contact details">
          <div className={row}>
            <span className="text-slate-400">Email</span>
            <span>{customer.email}</span>
          </div>
          <div className={row}>
            <span className="text-slate-400">Phone</span>
            <span>{customer.phone || "Not added"}</span>
          </div>
          <Link
            href="/account"
            className="mt-2 inline-block font-medium text-brand-600 hover:underline"
          >
            Edit in Profile
          </Link>
        </Section>

        <Section title="Shipping addresses">
          Manage the addresses used at checkout.
          <div>
            <Link
              href="/account/addresses"
              className="mt-2 inline-block font-medium text-brand-600 hover:underline"
            >
              Manage addresses
            </Link>
          </div>
        </Section>

        <Section title="Payment methods">
          <p>
            No saved payment methods. For your security, card details are entered
            fresh at checkout and are never stored on Nuvo.
          </p>
        </Section>

        <Section title="Privacy &amp; legal">
          <ul className="space-y-1.5">
            <li>
              <Link href="/privacy" className="text-brand-600 hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-brand-600 hover:underline">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="text-brand-600 hover:underline">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </Section>
      </div>
    </div>
  );
}
