"use client";

import { useState } from "react";

export type AddressValues = {
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
};

export const EMPTY_ADDRESS: AddressValues = {
  label: "",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  zip: "",
  country: "United Kingdom",
  isDefault: false,
};

const COUNTRIES = [
  "United Kingdom",
  "Ireland",
  "United States",
  "Canada",
  "Australia",
  "New Zealand",
  "France",
  "Germany",
  "Spain",
  "Italy",
  "Netherlands",
  "Belgium",
  "Portugal",
  "Sweden",
  "Denmark",
  "Norway",
  "Switzerland",
  "Austria",
  "India",
  "Other",
];

const field =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900";
const labelCls = "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

export default function AddressForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<AddressValues>;
  submitLabel: string;
  onSubmit: (v: AddressValues) => Promise<void>;
  onCancel?: () => void;
}) {
  const [v, setV] = useState<AddressValues>({ ...EMPTY_ADDRESS, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof AddressValues>(key: K, value: AddressValues[K]) {
    setV((prev) => ({ ...prev, [key]: value }));
  }

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(v);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save address.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handle} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Label (optional)</label>
          <input
            value={v.label}
            onChange={(e) => set("label", e.target.value)}
            placeholder="Home"
            className={field}
          />
        </div>
        <div>
          <label className={labelCls}>Full name</label>
          <input
            value={v.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            placeholder="Jordan Lee"
            className={field}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Street address</label>
        <input
          value={v.line1}
          onChange={(e) => set("line1", e.target.value)}
          placeholder="123 High Street"
          className={field}
        />
      </div>
      <div>
        <label className={labelCls}>Apartment, suite, etc. (optional)</label>
        <input
          value={v.line2}
          onChange={(e) => set("line2", e.target.value)}
          placeholder="Flat 4B"
          className={field}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>City / Town</label>
          <input
            value={v.city}
            onChange={(e) => set("city", e.target.value)}
            placeholder="London"
            className={field}
          />
        </div>
        <div>
          <label className={labelCls}>County / State (optional)</label>
          <input
            value={v.state}
            onChange={(e) => set("state", e.target.value)}
            placeholder="Greater London"
            className={field}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Postcode / ZIP</label>
          <input
            value={v.zip}
            onChange={(e) => set("zip", e.target.value)}
            placeholder="SW1A 1AA"
            className={field}
          />
        </div>
        <div>
          <label className={labelCls}>Country</label>
          <select
            value={v.country}
            onChange={(e) => set("country", e.target.value)}
            className={field}
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>Phone (optional)</label>
        <input
          value={v.phone}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="+44 7700 900000"
          className={field}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={v.isDefault}
          onChange={(e) => set("isDefault", e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
        />
        Set as default address
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {saving ? "Saving…" : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
