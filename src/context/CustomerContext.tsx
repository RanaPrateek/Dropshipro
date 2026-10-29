"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Customer = { id: string; email: string; name: string | null };

type CustomerContextType = {
  customer: Customer | null;
  loading: boolean;
  setCustomer: (c: Customer | null) => void;
  logout: () => Promise<void>;
  openAuth: () => void;
  closeAuth: () => void;
  authOpen: boolean;
};

const CustomerContext = createContext<CustomerContextType | null>(null);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    fetch("/api/account/me")
      .then((r) => r.json())
      .then((d) => setCustomer(d.customer ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function logout() {
    await fetch("/api/account/logout", { method: "POST" });
    setCustomer(null);
  }

  return (
    <CustomerContext.Provider
      value={{
        customer,
        loading,
        setCustomer,
        logout,
        openAuth: () => setAuthOpen(true),
        closeAuth: () => setAuthOpen(false),
        authOpen,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer(): CustomerContextType {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error("useCustomer must be used within CustomerProvider");
  return ctx;
}
