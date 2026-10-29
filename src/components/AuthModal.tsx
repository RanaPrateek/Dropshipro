"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomer } from "@/context/CustomerContext";
import Logo from "./Logo";

export default function AuthModal() {
  const router = useRouter();
  const { authOpen, closeAuth, setCustomer } = useCustomer();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!authOpen) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/account/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setCustomer(data.customer);
        closeAuth();
        setName("");
        setEmail("");
        setPassword("");
        router.refresh();
      } else {
        setError(data.error ?? "Something went wrong.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const input =
    "mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900";
  const social =
    "flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-400 dark:border-slate-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <button
        aria-label="Close"
        onClick={closeAuth}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
      />
      {/* dialog */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-slate-900">
        {/* header image / brand */}
        <div className="bg-gradient-to-br from-brand-500 to-violet-600 px-6 py-6 text-center text-white">
          <div className="flex justify-center">
            <span className="rounded-xl bg-white/15 px-3 py-2">
              <Logo wordmark />
            </span>
          </div>
          <p className="mt-3 text-sm text-white/90">
            Curated clothing &amp; electronics, delivered to your door.
          </p>
        </div>

        <div className="p-6">
          <div className="mb-4 flex rounded-xl bg-slate-100 p-1 text-sm font-medium dark:bg-slate-800">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); }}
                className={`flex-1 rounded-lg py-2 transition ${
                  mode === m ? "bg-white shadow dark:bg-slate-900" : "text-slate-500"
                }`}
              >
                {m === "login" ? "Sign in" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "register" && (
              <div>
                <label className="text-sm font-medium">Name</label>
                <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
            )}
            <div>
              <label className="text-sm font-medium">Email</label>
              <input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <input className={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3 text-xs text-slate-400">
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            or continue with
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["Google", "Apple", "Facebook"].map((p) => (
              <button key={p} type="button" disabled className={social} title="Coming soon">
                {p}
              </button>
            ))}
          </div>
          <p className="mt-2 text-center text-xs text-slate-400">
            Social sign-in coming soon
          </p>

          <p className="mt-5 text-center text-xs text-slate-400">
            By continuing you agree to our{" "}
            <a href="#" className="underline">Privacy Policy</a> and{" "}
            <a href="#" className="underline">Cookie Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
