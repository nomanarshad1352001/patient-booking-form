"use client";

import { useBookingStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function VisitModeToggle() {
  const { visitMode, setVisitMode, locale, theme } = useBookingStore();
  const isDark = theme === "dark";

  return (
    <div className={cn(
      "flex rounded-xl p-1",
      isDark ? "bg-brand-900/50" : "bg-brand-50"
    )}>
      {(["in_office", "online"] as const).map((mode) => (
        <button
          key={mode}
          onClick={() => setVisitMode(mode)}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300",
            visitMode === mode
              ? isDark
                ? "bg-brand-600 text-white shadow-lg shadow-brand-900/50"
                : "bg-white text-brand-700 shadow-md"
              : isDark
                ? "text-brand-300 hover:text-white"
                : "text-brand-400 hover:text-brand-600"
          )}
        >
          {mode === "in_office" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          )}
          {t(locale, mode === "in_office" ? "inOffice" : "online")}
        </button>
      ))}
    </div>
  );
}
