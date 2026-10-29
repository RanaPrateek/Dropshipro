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
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handlePhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 5);
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/reviews/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (res.ok) uploaded.push(data.path);
        else setError(data.error ?? "Photo upload failed");
      }
      setImages((prev) => [...prev, ...uploaded].slice(0, 5));
    } catch {
      setError("Photo upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (rating < 1) return setError("Please choose a star rating.");
    setSaving(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName, title, body, rating, images, orderNumber: orderToken }),
      });
      if (res.ok) {
        setDone(true);
        setRating(0);
        setAuthorName("");
        setTitle("");
        setBody("");
        setImages([]);
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

      <div>
        <label className="text-sm font-medium">Add photos (optional)</label>
        {images.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {images.map((img) => (
              <div key={img} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="review" className="h-16 w-16 rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((p) => p.filter((x) => x !== img))}
                  className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-xs text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotos}
          className="mt-2 block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
        />
        {uploading && <p className="mt-1 text-xs text-slate-400">Uploading…</p>}
        <p className="mt-1 text-xs text-slate-400">Up to 5 photos · JPG, PNG, WebP, GIF.</p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
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
