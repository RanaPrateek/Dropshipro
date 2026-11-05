"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCustomer } from "@/context/CustomerContext";
import Avatar from "./Avatar";

const LINKS = [
  { href: "/account", label: "Profile" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/settings", label: "Settings" },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { customer, logout } = useCustomer();

  async function signOut() {
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="md:sticky md:top-24 md:self-start">
      {/* identity card */}
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
        <Avatar src={customer?.image} name={customer?.name} size={48} />
        <div className="min-w-0">
          <div className="truncate font-semibold">
            {customer?.name || "Your account"}
          </div>
          <div className="truncate text-xs text-slate-400">
            {customer?.username ? `@${customer.username}` : customer?.email}
          </div>
        </div>
      </div>

      {/* nav */}
      <nav className="mt-4 flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
        {LINKS.map((l) => {
          const active =
            l.href === "/account"
              ? pathname === "/account"
              : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-brand-600 text-white"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
        <button
          onClick={signOut}
          className="whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm font-medium text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Sign out
        </button>
      </nav>
    </aside>
  );
}
