"use client";

import { useBookingStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const configs = {
  success: {
    iconBg: "from-green-400 to-emerald-500",
    ringColor: "bg-green-400/30",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    titleKey: "successTitle" as const,
    messageKey: "successMessage" as const,
    actionKey: "bookAnother" as const,
  },
  pending: {
    iconBg: "from-amber-400 to-orange-500",
    ringColor: "bg-amber-400/30",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    titleKey: "pendingTitle" as const,
    messageKey: "pendingMessage" as const,
    actionKey: "bookAnother" as const,
  },
  payment_failed: {
    iconBg: "from-red-400 to-rose-500",
    ringColor: "bg-red-400/30",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
        <line x1="8" y1="16" x2="8" y2="16" />
        <line x1="16" y1="16" x2="16" y2="16" />
      </svg>
    ),
    titleKey: "paymentFailedTitle" as const,
    messageKey: "paymentFailedMessage" as const,
    actionKey: "tryAgain" as const,
  },
  slot_taken: {
    iconBg: "from-orange-400 to-red-500",
    ringColor: "bg-orange-400/30",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="9" y1="10" x2="15" y2="16" />
        <line x1="15" y1="10" x2="9" y2="16" />
      </svg>
    ),
    titleKey: "slotTakenTitle" as const,
    messageKey: "slotTakenMessage" as const,
    actionKey: "chooseDifferentSlot" as const,
  },
  error: {
    iconBg: "from-red-500 to-rose-600",
    ringColor: "bg-red-400/30",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    titleKey: "errorTitle" as const,
    messageKey: "errorMessage" as const,
    actionKey: "tryAgain" as const,
  },
};

export function ResultScreen() {
  const { resultScreen, bookingId, locale, theme, reset, setResultScreen, setStep, setSelectedSlot } = useBookingStore();
  const isDark = theme === "dark";

  if (!resultScreen) return null;

  const config = configs[resultScreen];

  const handleAction = () => {
    if (resultScreen === "slot_taken") {
      setResultScreen(null);
      setSelectedSlot(null);
      setStep(1);
    } else if (resultScreen === "payment_failed" || resultScreen === "error") {
      setResultScreen(null);
      setStep(3);
    } else {
      reset();
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 animate-fade-in">
      <div className={cn(
        "w-full max-w-md rounded-2xl p-8 text-center",
        isDark ? "bg-brand-900/60 border border-brand-700" : "bg-white shadow-xl"
      )}>
        {/* Animated icon */}
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
          {/* Pulse rings */}
          <div className={cn("absolute inset-0 rounded-full animate-pulse-ring", config.ringColor)} />
          <div className={cn("absolute inset-2 rounded-full animate-pulse-ring", config.ringColor)} style={{ animationDelay: "0.5s" }} />
          {/* Icon circle */}
          <div className={cn(
            "relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br shadow-lg animate-scale-in",
            config.iconBg
          )}>
            {config.icon}
          </div>
        </div>

        <h2 className={cn(
          "mb-2 text-2xl font-bold animate-slide-up",
          isDark ? "text-white" : "text-slate-800"
        )}>
          {t(locale, config.titleKey)}
        </h2>

        <p className={cn(
          "mb-6 text-sm animate-slide-up",
          isDark ? "text-brand-300" : "text-slate-500"
        )} style={{ animationDelay: "0.1s" }}>
          {t(locale, config.messageKey)}
        </p>

        {/* Booking reference */}
        {bookingId && resultScreen === "success" && (
          <div className={cn(
            "mb-6 rounded-xl p-3 animate-slide-up",
            isDark ? "bg-brand-800/50" : "bg-brand-50"
          )} style={{ animationDelay: "0.2s" }}>
            <p className={cn("text-xs", isDark ? "text-brand-400" : "text-slate-500")}>
              {t(locale, "bookingRef")}
            </p>
            <p className={cn("font-mono text-sm font-bold", isDark ? "text-brand-200" : "text-brand-700")}>
              {bookingId.slice(0, 8).toUpperCase()}
            </p>
          </div>
        )}

        {/* Confetti-like sparkles for success */}
        {resultScreen === "success" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute animate-fade-in"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.15}s`,
                  fontSize: `${12 + Math.random() * 16}px`,
                  opacity: 0.6,
                }}
              >
                {["✨", "🎉", "💜", "🌟", "🎊"][i % 5]}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleAction}
          className={cn(
            "w-full rounded-xl py-3 text-sm font-bold transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
            isDark
              ? "bg-gradient-to-r from-brand-500 to-teal-500 text-white"
              : "bg-gradient-to-r from-brand-600 to-teal-500 text-white shadow-md"
          )}
        >
          {t(locale, config.actionKey)}
        </button>
      </div>
    </div>
  );
}
