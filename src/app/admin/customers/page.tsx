import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/admin/AdminActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Customers — Nuvo" };

function fmtDate(d: Date | null): string {
  if (!d) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function fmtDateTime(d: Date | null): string | null {
  if (!d) return null;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminCustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  // Only people who registered an account (have a password) are "members";
  // guests created at checkout have no password and no terms acceptance.
  const members = customers.filter((c) => c.passwordHash);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {members.length} registered {members.length === 1 ? "account" : "accounts"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400">
            Products
          </Link>
          <Link href="/admin/orders" className="text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400">
            Orders
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        {members.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            No registered customers yet. Accounts appear here when shoppers sign up.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Username</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Orders</th>
                <th className="px-4 py-3 font-medium">Terms accepted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {members.map((c) => {
                const accepted = fmtDateTime(c.termsAcceptedAt);
                return (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                    <td className="px-4 py-3">
                      <div className="font-medium">{c.name || "—"}</div>
                      <div className="text-xs text-slate-400">{c.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {c.username ? `@${c.username}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {fmtDate(c.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {c._count.orders}
                    </td>
                    <td className="px-4 py-3">
                      {accepted ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {accepted}
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          Not recorded
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        &ldquo;Not recorded&rdquo; means the account was created before Terms
        acceptance was tracked. New sign-ups always record the date and time.
      </p>
    </div>
  );
}
