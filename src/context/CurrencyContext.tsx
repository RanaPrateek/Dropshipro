"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type CurrencyCode } from "@/lib/currency";

type CurrencyContextType = {
  code: CurrencyCode;
  setCode: (c: CurrencyCode) => void;
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);

const STORAGE_KEY = "nuvo_currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [code, setCodeState] = useState<CurrencyCode>("USD");

  useEffect(() => {
    try {
      // 1) explicit user choice wins
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "USD" || saved === "GBP") {
        setCodeState(saved);
        return;
      }
      // 2) otherwise use the country cookie set at the edge (once deployed)
      const m = document.cookie.match(/(?:^|;\s*)nuvo_currency_geo=(USD|GBP)/);
      if (m) setCodeState(m[1] as CurrencyCode);
    } catch {
      // ignore
    }
  }, []);

  function setCode(c: CurrencyCode) {
    setCodeState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // ignore
    }
  }

  return (
    <CurrencyContext.Provider value={{ code, setCode }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextType {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
