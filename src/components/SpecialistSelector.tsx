"use client";

import { useEffect, useState } from "react";
import { useBookingStore, SpecialistData } from "@/lib/store";
import { t } from "@/lib/i18n";
import { cn, getInitials } from "@/lib/utils";

const AVATAR_COLORS = [
  "from-brand-400 to-brand-600",
  "from-teal-400 to-teal-600",
  "from-purple-400 to-purple-600",
  "from-pink-400 to-pink-600",
  "from-amber-400 to-amber-600",
  "from-cyan-400 to-cyan-600",
];

export function SpecialistSelector() {
  const {
    visitMode,
    selectedService,
    selectedSpecialist,
    setSelectedSpecialist,
    locale,
    theme,
    clinic,
  } = useBookingStore();
  const isDark = theme === "dark";
  const [specialists, setSpecialists] = useState<SpecialistData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (clinic) params.set("clinicId", clinic.id);
    if (selectedService) params.set("serviceId", selectedService.id);

    fetch(`/api/specialists?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setSpecialists(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [clinic, selectedService]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className={cn("skeleton h-16 rounded-xl", isDark && "dark")} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2 stagger-children">
      <label className={cn(
        "block text-sm font-semibold",
        isDark ? "text-brand-200" : "text-slate-700"
      )}>
        {t(locale, "selectSpecialist")}
      </label>

      {/* Any specialist option */}
      <button
        onClick={() => setSelectedSpecialist(null)}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all duration-300",
          !selectedSpecialist
            ? isDark
              ? "border-brand-500 bg-brand-900/60 shadow-lg"
              : "border-brand-500 bg-brand-50 shadow-md"
            : isDark
              ? "border-brand-800/50 bg-brand-950/40 hover:border-brand-600"
              : "border-slate-200 bg-white hover:border-brand-300"
        )}
      >
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br",
          !selectedSpecialist ? "from-brand-400 to-teal-500" : "from-slate-300 to-slate-400"
        )}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <span className={cn(
          "font-medium",
          !selectedSpecialist
            ? isDark ? "text-white" : "text-brand-700"
            : isDark ? "text-brand-300" : "text-slate-600"
        )}>
          {t(locale, "anySpecialist")}
        </span>
      </button>

      {specialists.map((spec, idx) => {
        const isSelected = selectedSpecialist?.id === spec.id;
        const colorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length];

        return (
          <button
            key={spec.id}
            onClick={() => setSelectedSpecialist(isSelected ? null : spec)}
            className={cn(
              "group relative flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all duration-300",
              isSelected
                ? isDark
                  ? "border-brand-500 bg-brand-900/60 shadow-lg shadow-brand-900/30"
                  : "border-brand-500 bg-brand-50 shadow-md shadow-brand-100/50"
                : isDark
                  ? "border-brand-800/50 bg-brand-950/40 hover:border-brand-600 hover:bg-brand-900/40"
                  : "border-slate-200 bg-white hover:border-brand-300 hover:shadow-sm"
            )}
          >
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white",
              colorClass
            )}>
              {getInitials(spec.firstName, spec.lastName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn(
                "font-medium truncate",
                isSelected
                  ? isDark ? "text-white" : "text-brand-700"
                  : isDark ? "text-white" : "text-slate-800"
              )}>
                {spec.title ? `${spec.title} ` : ""}{spec.firstName} {spec.lastName}
              </p>
              {spec.specialty && (
                <p className={cn(
                  "text-xs truncate",
                  isDark ? "text-brand-300" : "text-slate-500"
                )}>
                  {spec.specialty}
                </p>
              )}
            </div>

            {isSelected && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-white animate-scale-in">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
