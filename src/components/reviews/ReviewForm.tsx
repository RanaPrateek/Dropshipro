"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewForm({
  productId,
  orderToken,
}: {
  productId: string;
  orderToken?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(Boolean(orderToken));
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [authorName, setAuthorName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (rating < 1) return setError("Please choose a star rating.");
    setSaving(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName, title, body, rating, orderNumber: orderToken }),
      });
      if (res.ok) {
        setDone(true);
        setRating(0);
        setAuthorName("");
        setTitle("");
        setBody("");
        router.refresh();
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Could not submit review.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (done && !open) {
    return (
      <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
        Thanks for your review! It&apos;s now live.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl border border-brand-600 px-5 py-2.5 font-semibold text-brand-700 hover:bg-brand-50 dark:text-brand-200 dark:hover:bg-slate-800"
      >
        Write a review
      </button>
    );
  }

  const input =
    "mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900";

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
    >
      <div>
        <label className="text-sm font-medium">Your rating</label>
        <div className="mt-1 flex gap-1 text-2xl">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className={
                (hover || rating) >= n ? "text-amber-500" : "text-slate-300 dark:text-slate-600"
              }
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Your name</label>
          <input
            className={input}
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="e.g. Alex P."
          />
        </div>
        <div>
          <label className="text-sm font-medium">Title (optional)</label>
          <input
            className={input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Great quality!"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Your review</label>
        <textarea
          className={`${input} min-h-[90px]`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What did you think of the product?"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-brand-600 px-6 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {saving ? "Submitting…" : "Submit review"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-xl border border-slate-300 px-6 py-2.5 font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
