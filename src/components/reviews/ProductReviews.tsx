import type { StoreReview, ReviewSummary } from "@/lib/reviews";
import ReviewForm from "./ReviewForm";

function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span className="text-amber-500">
      {"★".repeat(full)}
      <span className="text-slate-300 dark:text-slate-600">{"★".repeat(5 - full)}</span>
    </span>
  );
}

function timeAgo(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ProductReviews({
  productId,
  reviews,
  summary,
  orderToken,
}: {
  productId: string;
  reviews: StoreReview[];
  summary: ReviewSummary;
  orderToken?: string;
}) {
  return (
    <section
      id="reviews"
      className="mt-14 scroll-mt-28 border-t border-slate-200 pt-10 dark:border-slate-800"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customer reviews</h2>
          {summary.count > 0 ? (
            <div className="mt-1 flex items-center gap-2 text-sm">
              <Stars value={summary.average} />
              <span className="text-slate-600 dark:text-slate-300">
                {summary.average.toFixed(1)} out of 5 · {summary.count}{" "}
                {summary.count === 1 ? "review" : "reviews"}
              </span>
            </div>
          ) : (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              No reviews yet — be the first to review this product.
            </p>
          )}
        </div>
        <ReviewForm productId={productId} orderToken={orderToken} />
      </div>

      {reviews.length > 0 && (
        <ul className="mt-8 space-y-6">
          {reviews.map((r) => (
            <li key={r.id} className="border-b border-slate-100 pb-6 last:border-0 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Stars value={r.rating} />
                {r.verified && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    ✓ Verified buyer
                  </span>
                )}
              </div>
              {r.title && <h3 className="mt-2 font-semibold">{r.title}</h3>}
              <p className="mt-1 whitespace-pre-line text-slate-600 dark:text-slate-300">
                {r.body}
              </p>
              {r.images.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.images.map((img) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <a key={img} href={img} target="_blank" rel="noreferrer">
                      <img
                        src={img}
                        alt="Customer photo"
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                    </a>
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs text-slate-400">
                {r.authorName} · {timeAgo(r.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
