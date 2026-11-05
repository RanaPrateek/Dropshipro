"use client";

import { useEffect, useState } from "react";
import AddressForm, { AddressValues } from "./AddressForm";

export type Address = {
  id: string;
  label: string | null;
  fullName: string;
  phone: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  zip: string;
  country: string;
  isDefault: boolean;
};

export default function AddressBook() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/account/addresses");
      const data = await res.json();
      setAddresses(data.addresses ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function create(v: AddressValues) {
    const res = await fetch("/api/account/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not save address.");
    setAdding(false);
    await load();
  }

  async function update(id: string, v: AddressValues) {
    const res = await fetch(`/api/account/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not update address.");
    setEditingId(null);
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this address?")) return;
    await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    await load();
  }

  async function makeDefault(a: Address) {
    await fetch(`/api/account/addresses/${a.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...a, isDefault: true }),
    });
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Addresses</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Saved addresses speed up checkout.
          </p>
        </div>
        {!adding && (
          <button
            onClick={() => {
              setAdding(true);
              setEditingId(null);
            }}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Add address
          </button>
        )}
      </div>

      {adding && (
        <div className="mt-6 rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
          <h2 className="mb-4 font-semibold">New address</h2>
          <AddressForm
            submitLabel="Save address"
            onSubmit={create}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-slate-500">Loading…</p>
      ) : addresses.length === 0 && !adding ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No saved addresses yet.
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {addresses.map((a) =>
            editingId === a.id ? (
              <li
                key={a.id}
                className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
              >
                <h2 className="mb-4 font-semibold">Edit address</h2>
                <AddressForm
                  initial={{
                    label: a.label ?? "",
                    fullName: a.fullName,
                    phone: a.phone ?? "",
                    line1: a.line1,
                    line2: a.line2 ?? "",
                    city: a.city,
                    state: a.state ?? "",
                    zip: a.zip,
                    country: a.country,
                    isDefault: a.isDefault,
                  }}
                  submitLabel="Save changes"
                  onSubmit={(v) => update(a.id, v)}
                  onCancel={() => setEditingId(null)}
                />
              </li>
            ) : (
              <li
                key={a.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
              >
                <div className="text-sm">
                  <div className="flex items-center gap-2 font-semibold">
                    {a.label || a.fullName}
                    {a.isDefault && (
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-slate-800 dark:text-brand-300">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-slate-500 dark:text-slate-400">
                    {a.label ? `${a.fullName}, ` : ""}
                    {a.line1}
                    {a.line2 ? `, ${a.line2}` : ""}, {a.city}
                    {a.state ? `, ${a.state}` : ""} {a.zip}, {a.country}
                    {a.phone ? ` · ${a.phone}` : ""}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-sm font-medium">
                  {!a.isDefault && (
                    <button
                      onClick={() => makeDefault(a)}
                      className="text-slate-500 hover:text-brand-600"
                    >
                      Set default
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingId(a.id);
                      setAdding(false);
                    }}
                    className="text-brand-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(a.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}
