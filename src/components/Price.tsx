"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { formatMoney } from "@/lib/currency";

/** Displays USD-cents in the viewer's selected currency. */
export default function Price({
  cents,
  className = "",
}: {
  cents: number;
  className?: string;
}) {
  const { code } = useCurrency();
  return <span className={className}>{formatMoney(cents, code)}</span>;
}
