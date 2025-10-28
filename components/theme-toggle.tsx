"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  const current = theme === "system" ? systemTheme : theme;

  if (!mounted)
    return (
      <button
        aria-label="Changer le thème"
        className="inline-flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-sm bg-white dark:bg-gray-800"
      >
        Thème
      </button>
    );

  return (
    <button
      onClick={() => {
        const next = current === "dark" ? "light" : "dark";
        setTheme(next);
        // Forcer la classe sur <html> pour éviter les états incohérents
        if (typeof document !== "undefined") {
          const root = document.documentElement;
          if (next === "dark") root.classList.add("dark");
          else root.classList.remove("dark");
        }
      }}
      aria-label="Changer le thème"
      className="inline-flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-sm bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      title={`Passer en mode ${current === "dark" ? "clair" : "sombre"}`}
    >
      {current === "dark" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path d="M21.64 13a1 1 0 0 0-1.05-.14A8 8 0 0 1 11.1 4.41a1 1 0 0 0-.14-1.05A1 1 0 0 0 9.78 3 10 10 0 1 0 21 14.22a1 1 0 0 0-.64-1.22Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zm9.83-19.16l-1.79-1.79-1.8 1.79 1.8 1.79 1.79-1.79zM17.24 19.16l1.8 1.79 1.79-1.79-1.79-1.79-1.8 1.79zM20 11v2h3v-2h-3zM4.22 18.36l-1.8 1.79 1.8 1.79 1.79-1.79-1.79-1.79zM11 1h2v3h-2V1z" />
        </svg>
      )}
      <span className="hidden sm:inline">
        {current === "dark" ? "Sombre" : "Clair"}
      </span>
    </button>
  );
}
