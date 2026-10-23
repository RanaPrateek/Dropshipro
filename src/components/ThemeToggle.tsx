"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    const root = document.documentElement;
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("nuvo_theme", next ? "dark" : "light");
    } catch {
      // ignore
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className={`grid h-9 w-9 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 ${className}`}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
