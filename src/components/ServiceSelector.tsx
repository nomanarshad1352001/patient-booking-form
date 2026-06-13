"use client";

import { useEffect, useState } from "react";
import { useBookingStore, ServiceData } from "@/lib/store";
import { t } from "@/lib/i18n";
import { cn, formatPrice } from "@/lib/utils";

export function ServiceSelector() {
  const {
    visitMode,
    selectedService,
    setSelectedService,
    selectedSpecialist,
    locale,
    theme,
    clinic,
  } = useBookingStore();
  const isDark = theme === "dark";
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (clinic) params.set("clinicId", clinic.id);
    if (selectedSpecialist) params.set("specialistId", selectedSpecialist.id);
    params.set("mode", visitMode);

    fetch(`/api/services?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [clinic, visitMode, selectedSpecialist]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className={cn("skeleton h-20 rounded-xl", isDark && "dark")} />
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
        {t(locale, "selectService")}
      </label>
      {services.map((svc) => {
        const isSelected = selectedService?.id === svc.id;
        const serviceName = locale === "en" && svc.nameEn ? svc.nameEn : svc.name;

        return (
          <button
            key={svc.id}
            onClick={() => setSelectedService(isSelected ? null : svc)}
            className={cn(
              "group relative flex w-full items-center justify-between rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-300",
              isSelected
                ? isDark
                  ? "border-brand-500 bg-brand-900/60 shadow-lg shadow-brand-900/30"
                  : "border-brand-500 bg-brand-50 shadow-md shadow-brand-100/50"
                : isDark
                  ? "border-brand-800/50 bg-brand-950/40 hover:border-brand-600 hover:bg-brand-900/40"
                  : "border-slate-200 bg-white hover:border-brand-300 hover:shadow-sm"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                isSelected
                  ? isDark ? "bg-brand-500 text-white" : "bg-brand-500 text-white"
                  : isDark ? "bg-brand-800/50 text-brand-300" : "bg-brand-100 text-brand-500"
              )}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div>
                <p className={cn(
                  "font-medium",
                  isSelected
                    ? isDark ? "text-white" : "text-brand-700"
                    : isDark ? "text-white" : "text-slate-800"
                )}>
                  {serviceName}
                </p>
                <p className={cn(
                  "text-xs",
                  isDark ? "text-brand-300" : "text-slate-500"
                )}>
                  {svc.durationMinutes} {t(locale, "duration")}
                </p>
              </div>
            </div>
            <div className={cn(
              "rounded-lg px-3 py-1 text-sm font-bold",
              isSelected
                ? isDark ? "bg-brand-500/30 text-brand-200" : "bg-brand-100 text-brand-700"
                : isDark ? "bg-brand-800/30 text-brand-300" : "bg-slate-100 text-slate-600"
            )}>
              {formatPrice(svc.priceGrosze, svc.currency)}
            </div>

            {/* Selection checkmark */}
            {isSelected && (
              <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-white animate-scale-in">
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
