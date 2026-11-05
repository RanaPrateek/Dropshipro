"use client";

import { useState } from "react";

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      {off ? (
        <>
          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 10 8 10 8a18.5 18.5 0 01-2.16 3.19M6.6 6.6A18.8 18.8 0 002 12s3 8 10 8a9.3 9.3 0 005.4-1.6" />
          <path d="M14.12 14.12A3 3 0 019.88 9.88" />
          <path d="M3 3l18 18" />
        </>
      ) : (
        <>
          <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  required?: boolean;
  autoComplete?: string;
};

/** Password field with a show/hide (eye) toggle. */
export default function PasswordInput({
  value,
  onChange,
  placeholder = "••••••••",
  className = "",
  autoFocus,
  required,
  autoComplete,
}: Props) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        required={required}
        autoComplete={autoComplete}
        className={`${className} pr-11`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        title={show ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 grid -translate-y-1/2 place-items-center rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
      >
        <EyeIcon off={show} />
      </button>
    </div>
  );
}
