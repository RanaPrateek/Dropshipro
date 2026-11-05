"use client";

import { useEffect, useRef, useState } from "react";
import type { GeoResult } from "@/lib/geo";

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M12 21s-7-5.2-7-11a7 7 0 1114 0c0 5.8-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

/**
 * A search box that autocompletes real addresses (via /api/geo/search) and a
 * "Use my location" button (via browser geolocation + /api/geo/reverse).
 * Picking a result calls onSelect with the structured address.
 */
export default function AddressAutocomplete({
  onSelect,
}: {
  onSelect: (r: GeoResult) => void;
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // Debounced search.
  useEffect(() => {
    const term = q.trim();
    if (term.length < 3) {
      setResults([]);
      return;
    }
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geo/search?q=${encodeURIComponent(term)}`);
        const data = await res.json();
        setResults(data.results ?? []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 450);
    return () => clearTimeout(t);
  }, [q]);

  // Close the dropdown on outside click.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function choose(r: GeoResult) {
    onSelect(r);
    setQ("");
    setResults([]);
    setOpen(false);
    setNote(null);
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setNote("Your browser doesn't support location access.");
      return;
    }
    setLocating(true);
    setNote(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`/api/geo/reverse?lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data.result) choose(data.result);
          else setNote("Couldn't find your address. Please enter it manually.");
        } catch {
          setNote("Couldn't look up your location. Please enter it manually.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setNote("Location access was blocked. Please enter your address manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  const field =
    "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900";

  return (
    <div ref={boxRef} className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => results.length && setOpen(true)}
            placeholder="Start typing your address…"
            className={field}
          />
          {searching && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              …
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <PinIcon />
          {locating ? "Locating…" : "Use my location"}
        </button>
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {results.map((r, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => choose(r)}
                className="flex w-full items-start gap-2 px-3.5 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <span className="mt-0.5 text-slate-400">
                  <PinIcon />
                </span>
                <span className="text-slate-600 dark:text-slate-300">{r.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {note && <p className="mt-2 text-xs text-amber-600">{note}</p>}
    </div>
  );
}
