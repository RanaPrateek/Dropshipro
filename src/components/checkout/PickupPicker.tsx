"use client";

import { useEffect, useRef, useState } from "react";
import type { GeoResult } from "@/lib/geo";

export type Pickup = {
  name: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

// Turn a geocoded place into a believable named pickup point.
function toPickup(r: GeoResult, i: number): Pickup {
  const names = ["Nuvo Locker", "Nuvo Pickup Point", "Nuvo Collect"];
  const place = r.city || r.label.split(",")[0];
  return {
    name: `${names[i % names.length]} — ${place}`,
    line1: r.line1 || r.label.split(",")[0],
    city: r.city,
    state: r.state,
    zip: r.zip,
    country: r.country,
  };
}

export default function PickupPicker({
  selected,
  onSelect,
}: {
  selected: Pickup | null;
  onSelect: (p: Pickup) => void;
}) {
  const [q, setQ] = useState("");
  const [points, setPoints] = useState<Pickup[]>([]);
  const [searching, setSearching] = useState(false);
  const firstRun = useRef(true);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 3) {
      setPoints([]);
      return;
    }
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geo/search?q=${encodeURIComponent(term)}`);
        const data = await res.json();
        const results: GeoResult[] = data.results ?? [];
        setPoints(results.slice(0, 4).map((r, i) => toPickup(r, i)));
      } catch {
        setPoints([]);
      } finally {
        setSearching(false);
      }
    }, 450);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    firstRun.current = false;
  }, []);

  const field =
    "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900";

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Enter a town or postcode to find pickup points…"
        className={field}
      />
      {searching && <p className="mt-2 text-xs text-slate-400">Searching…</p>}

      {points.length > 0 && (
        <ul className="mt-3 space-y-2">
          {points.map((p, i) => {
            const active =
              selected &&
              selected.name === p.name &&
              selected.zip === p.zip &&
              selected.line1 === p.line1;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => onSelect(p)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition ${
                    active
                      ? "border-brand-500 bg-brand-50 dark:bg-slate-800"
                      : "border-slate-200 hover:border-slate-300 dark:border-slate-700"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                      active ? "border-brand-600 bg-brand-600" : "border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {active && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>
                  <span>
                    <span className="font-medium">{p.name}</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">
                      {[p.line1, p.city, p.zip, p.country].filter(Boolean).join(", ")}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
