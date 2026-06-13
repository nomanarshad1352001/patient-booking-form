"use client";

import { useBookingStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Header() {
  const { theme, toggleTheme, locale, setLocale, step } = useBookingStore();
  const isDark = theme === "dark";

  return (
    <header
      className={cn(
        "relative overflow-hidden",
        isDark
          ? "bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900"
          : "bg-gradient-to-r from-brand-600 via-brand-500 to-teal-500"
      )}
    >
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={cn(
          "absolute -top-10 -left-10 h-40 w-40 rounded-full opacity-10",
          isDark ? "bg-brand-300" : "bg-white"
        )} style={{ animation: "pulse-ring 4s ease-in-out infinite" }} />
        <div className={cn(
          "absolute -bottom-8 -right-8 h-32 w-32 rounded-full opacity-10",
          isDark ? "bg-teal-300" : "bg-white"
        )} style={{ animation: "pulse-ring 5s ease-in-out infinite 1s" }} />
        <div className={cn(
          "absolute top-1/2 left-1/3 h-20 w-20 rounded-full opacity-5",
          isDark ? "bg-brand-200" : "bg-white"
        )} style={{ animation: "pulse-ring 6s ease-in-out infinite 2s" }} />
      </div>

      <div className="relative px-4 py-5 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo icon */}
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              isDark ? "bg-white/10 backdrop-blur-sm" : "bg-white/20 backdrop-blur-sm"
            )}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white sm:text-xl">
                {t(locale, "bookVisit")}
              </h1>
              <p className="text-xs text-white/70">
                Centrum Terapii Harmonia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => setLocale(locale === "pl" ? "en" : "pl")}
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all hover:scale-105",
                isDark
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-white/20 text-white hover:bg-white/30"
              )}
            >
              {locale === "pl" ? "EN" : "PL"}
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={cn(
                "rounded-lg p-2 transition-all hover:scale-105",
                isDark
                  ? "bg-white/10 text-yellow-300 hover:bg-white/20"
                  : "bg-white/20 text-white hover:bg-white/30"
              )}
              title={isDark ? t(locale, "lightMode") : t(locale, "darkMode")}
            >
              {isDark ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Step indicator */}
        <div className="mx-auto mt-4 flex max-w-3xl items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div className="flex-1">
                <div className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  s <= step
                    ? isDark ? "bg-teal-400" : "bg-white"
                    : isDark ? "bg-white/10" : "bg-white/30"
                )} />
              </div>
              {s < 3 && (
                <div className={cn(
                  "h-1 w-1 rounded-full",
                  s < step
                    ? isDark ? "bg-teal-400" : "bg-white"
                    : isDark ? "bg-white/10" : "bg-white/30"
                )} />
              )}
            </div>
          ))}
        </div>
        <div className="mx-auto mt-1.5 flex max-w-3xl items-center justify-between px-1">
          {[
            { n: 1, key: "step1Title" as const },
            { n: 2, key: "step2Title" as const },
            { n: 3, key: "step3Title" as const },
          ].map((s) => (
            <span
              key={s.n}
              className={cn(
                "text-[10px] font-medium transition-colors sm:text-xs",
                s.n <= step ? "text-white" : "text-white/40"
              )}
            >
              {t(locale, s.key)}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
