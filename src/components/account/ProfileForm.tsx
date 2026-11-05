"use client";

import { useEffect, useRef, useState } from "react";
import { useCustomer } from "@/context/CustomerContext";
import Avatar from "./Avatar";

export default function ProfileForm() {
  const { customer, setCustomer, loading } = useCustomer();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Seed the form once the customer loads.
  useEffect(() => {
    if (customer) {
      setName(customer.name ?? "");
      setUsername(customer.username ?? "");
      setPhone(customer.phone ?? "");
    }
  }, [customer]);

  if (loading) {
    return <div className="text-slate-500">Loading…</div>;
  }
  if (!customer) return null;

  async function uploadAvatar(file: File) {
    setUploading(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/account/avatar", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      setCustomer(data.customer);
      setMsg({ type: "ok", text: "Profile picture updated." });
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "Upload failed." });
    } finally {
      setUploading(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save.");
      setCustomer(data.customer);
      setMsg({ type: "ok", text: "Profile saved." });
    } catch (err) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "Could not save." });
    } finally {
      setSaving(false);
    }
  }

  const field =
    "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900";
  const labelCls = "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <div>
      <h1 className="text-2xl font-bold">Profile</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Manage how you appear and how we reach you.
      </p>

      {/* avatar */}
      <div className="mt-6 flex items-center gap-4">
        <Avatar src={customer.image} name={customer.name} size={72} />
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadAvatar(f);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            {uploading ? "Uploading…" : "Change picture"}
          </button>
          <p className="mt-1.5 text-xs text-slate-400">JPG, PNG, WebP or GIF, up to 5 MB.</p>
        </div>
      </div>

      {/* details */}
      <form onSubmit={save} className="mt-8 max-w-md space-y-5">
        <div>
          <label className={labelCls}>Full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jordan Lee"
            className={field}
          />
        </div>

        <div>
          <label className={labelCls}>Username</label>
          <div className="flex items-center rounded-xl border border-slate-300 bg-white px-3.5 focus-within:border-brand-500 dark:border-slate-700 dark:bg-slate-900">
            <span className="text-sm text-slate-400">@</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="jordan"
              className="w-full bg-transparent py-2.5 pl-1 text-sm outline-none"
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            3–20 characters: letters, numbers or underscores. Must be unique.
          </p>
        </div>

        <div>
          <label className={labelCls}>Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+44 7700 900000"
            className={field}
          />
        </div>

        <div>
          <label className={labelCls}>Email</label>
          <input value={customer.email} disabled className={`${field} opacity-60`} />
          <p className="mt-1.5 text-xs text-slate-400">
            Your email is used to sign in and can&apos;t be changed here.
          </p>
        </div>

        {msg && (
          <p
            className={`text-sm ${
              msg.type === "ok" ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {msg.text}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
