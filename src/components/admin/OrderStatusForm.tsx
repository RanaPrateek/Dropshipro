"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = [
  "PENDING",
  "PAID",
  "ORDERED_WITH_SUPPLIER",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

const LABELS: Record<string, string> = {
  PENDING: "Pending payment",
  PAID: "Paid",
  ORDERED_WITH_SUPPLIER: "Ordered with supplier",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export default function OrderStatusForm({
  orderId,
  initialStatus,
  initialTracking,
  initialCarrier,
}: {
  orderId: string;
  initialStatus: string;
  initialTracking: string;
  initialCarrier: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [tracking, setTracking] = useState(initialTracking);
  const [carrier, setCarrier] = useState(initialCarrier);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    setSaved(false);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, trackingNumber: tracking, carrier }),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  }

  const input =
    "mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900";

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
      <h2 className="font-semibold">Fulfillment</h2>
      <div>
        <label className="text-sm font-medium">Status</label>
        <select className={input} value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {LABELS[s]}
            </option>
          ))}
        </select>
        {status === "DELIVERED" && (
          <p className="mt-1 text-xs text-slate-400">
            Marking as Delivered sends the customer a “leave a review” email.
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">Tracking number</label>
          <input className={input} value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="e.g. LX123456789CN" />
        </div>
        <div>
          <label className="text-sm font-medium">Carrier</label>
          <input className={input} value={carrier} onChange={(e) => setCarrier(e.target.value)} placeholder="e.g. DHL" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-xl bg-brand-600 px-6 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {saved && <span className="text-sm text-emerald-600">Saved ✓</span>}
      </div>
    </div>
  );
}
