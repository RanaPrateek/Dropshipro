// Compact, recognizable payment brand marks as inline SVG (no external images).

function Card({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-7 w-11 items-center justify-center rounded-md border border-slate-200 bg-white dark:border-slate-700">
      {children}
    </span>
  );
}

export default function PaymentLogos() {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Visa */}
      <Card>
        <span className="text-[11px] font-bold italic tracking-tight text-[#1a1f71]">
          VISA
        </span>
      </Card>

      {/* Mastercard */}
      <Card>
        <svg viewBox="0 0 40 24" className="h-4">
          <circle cx="16" cy="12" r="8" fill="#EB001B" />
          <circle cx="24" cy="12" r="8" fill="#F79E1B" fillOpacity="0.9" />
        </svg>
      </Card>

      {/* Amex */}
      <span className="inline-flex h-7 w-11 items-center justify-center rounded-md bg-[#2e77bb]">
        <span className="text-[8px] font-bold leading-tight text-white">AMEX</span>
      </span>

      {/* PayPal */}
      <Card>
        <span className="text-[10px] font-bold italic">
          <span className="text-[#003087]">Pay</span>
          <span className="text-[#009cde]">Pal</span>
        </span>
      </Card>

      {/* Apple Pay */}
      <Card>
        <span className="flex items-center gap-0.5 text-[10px] font-semibold text-black dark:text-white">
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
            <path d="M16 13c0-2 1.6-3 1.7-3-1-1.4-2.4-1.6-3-1.6-1.3-.1-2.5.7-3.1.7-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2-1.4 2.5-.4 6.2 1 8.2.7 1 1.5 2.1 2.5 2 1-.1 1.4-.6 2.6-.6s1.5.6 2.6.6 1.7-1 2.4-2c.5-.7.9-1.5 1-1.6-.1 0-1.9-.8-2-3zM14 6.3c.5-.7.9-1.6.8-2.6-.8 0-1.8.6-2.4 1.3-.5.6-1 1.5-.8 2.5.9.1 1.8-.5 2.4-1.2z" />
          </svg>
          Pay
        </span>
      </Card>
    </div>
  );
}
