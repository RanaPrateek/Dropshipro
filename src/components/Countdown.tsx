"use client";

import { useEffect, useState } from "react";

/** Red 24h-style countdown to an expiry timestamp (ISO string). */
export default function Countdown({
  expiresAt,
  className = "",
  compact = false,
}: {
  expiresAt: string;
  className?: string;
  compact?: boolean;
}) {
  const [remaining, setRemaining] = useState<number>(() =>
    Math.max(0, new Date(expiresAt).getTime() - Date.now()),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.max(0, new Date(expiresAt).getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  if (remaining <= 0) {
    return (
      <span className={`font-semibold text-slate-400 ${className}`}>
        Deal ended
      </span>
    );
  }

  const totalSec = Math.floor(remaining / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold tabular-nums text-rose-600 ${className}`}
    >
      <span>
        {h}:{m}:{s}
      </span>
      {!compact && <span className="font-normal text-rose-500">left</span>}
    </span>
  );
}
