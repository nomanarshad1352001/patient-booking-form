"use client";

import { useEffect, useState, useMemo } from "react";
import { useBookingStore, SlotData } from "@/lib/store";
import { t } from "@/lib/i18n";
import { cn, formatTime, formatPrice } from "@/lib/utils";
import { addDays, startOfWeek, endOfWeek, format, isSameDay } from "date-fns";
import { pl, enGB } from "date-fns/locale";

export function TimeSlotPicker() {
  const {
    visitMode,
    selectedService,
    selectedSpecialist,
    selectedSlot,
    setSelectedSlot,
    locale,
    theme,
  } = useBookingStore();
  const isDark = theme === "dark";
  const [slots, setSlots] = useState<SlotData[]>([]);
  const [loading, setLoading] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = useMemo(() => {
    const now = new Date();
    const start = startOfWeek(now, { weekStartsOn: 1 });
    return addDays(start, weekOffset * 7);
  }, [weekOffset]);

  const weekEnd = useMemo(() => endOfWeek(weekStart, { weekStartsOn: 1 }), [weekStart]);

  const days = useMemo(() => {
    const result = [];
    for (let i = 0; i < 7; i++) {
      result.push(addDays(weekStart, i));
    }
    return result;
  }, [weekStart]);

  useEffect(() => {
    if (!selectedService) return;
    setLoading(true);
    const params = new URLSearchParams();
    params.set("serviceId", selectedService.id);
    params.set("mode", visitMode);
    params.set("dateFrom", weekStart.toISOString());
    params.set("dateTo", weekEnd.toISOString());
    if (selectedSpecialist) params.set("specialistId", selectedSpecialist.id);

    fetch(`/api/slots?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setSlots(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedService, selectedSpecialist, visitMode, weekStart, weekEnd]);

  if (!selectedService) return null;

  const slotsByDay = days.map((day) => ({
    date: day,
    slots: slots.filter((s) => isSameDay(new Date(s.startTime), day)),
  }));

  const hasAnySlots = slotsByDay.some((d) => d.slots.length > 0);
  const dtLocale = locale === "pl" ? pl : enGB;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className={cn(
          "text-sm font-semibold",
          isDark ? "text-brand-200" : "text-slate-700"
        )}>
          {t(locale, "selectTimeSlot")}
        </label>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
            disabled={weekOffset === 0}
            className={cn(
              "rounded-lg p-1.5 transition-all",
              weekOffset === 0
                ? "opacity-30 cursor-not-allowed"
                : isDark
                  ? "text-brand-300 hover:bg-brand-800"
                  : "text-slate-500 hover:bg-slate-100"
            )}
            title={t(locale, "prevWeek")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className={cn(
            "text-xs font-medium px-2",
            isDark ? "text-brand-300" : "text-slate-500"
          )}>
            {format(weekStart, "d MMM", { locale: dtLocale })} – {format(weekEnd, "d MMM yyyy", { locale: dtLocale })}
          </span>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className={cn(
              "rounded-lg p-1.5 transition-all",
              isDark
                ? "text-brand-300 hover:bg-brand-800"
                : "text-slate-500 hover:bg-slate-100"
            )}
            title={t(locale, "nextWeek")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className={cn("skeleton h-8 rounded-lg", isDark && "dark")} />
              <div className={cn("skeleton h-8 rounded-lg", isDark && "dark")} />
              <div className={cn("skeleton h-8 rounded-lg", isDark && "dark")} />
            </div>
          ))}
        </div>
      ) : !hasAnySlots ? (
        <div className={cn(
          "rounded-xl border-2 border-dashed py-8 text-center",
          isDark ? "border-brand-800 bg-brand-950/30" : "border-slate-200 bg-slate-50"
        )}>
          <div className={cn(
            "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full",
            isDark ? "bg-brand-800/50" : "bg-slate-200"
          )}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn(isDark ? "text-brand-400" : "text-slate-400")}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <p className={cn(
            "text-sm font-medium",
            isDark ? "text-brand-300" : "text-slate-500"
          )}>
            {t(locale, "noSlotsAvailable")}
          </p>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className={cn(
              "mt-2 text-sm font-semibold transition-colors",
              isDark ? "text-brand-400 hover:text-brand-300" : "text-brand-600 hover:text-brand-700"
            )}
          >
            {t(locale, "tryNextWeek")} →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {slotsByDay.map(({ date, slots: daySlots }) => {
            const isToday = isSameDay(date, new Date());
            const isPast = date < new Date() && !isToday;

            return (
              <div key={date.toISOString()} className="min-w-0">
                <div className={cn(
                  "mb-1.5 rounded-lg py-1 text-center text-[10px] font-semibold uppercase",
                  isToday
                    ? isDark ? "bg-brand-600/30 text-brand-300" : "bg-brand-100 text-brand-700"
                    : isDark ? "text-brand-400" : "text-slate-500"
                )}>
                  <div>{format(date, "EEE", { locale: dtLocale })}</div>
                  <div className={cn(
                    "text-sm",
                    isToday
                      ? isDark ? "text-brand-200" : "text-brand-800"
                      : isDark ? "text-white" : "text-slate-800"
                  )}>
                    {format(date, "d")}
                  </div>
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {daySlots.length === 0 ? (
                    <div className={cn(
                      "rounded-lg py-2 text-center text-[10px]",
                      isDark ? "text-brand-700" : "text-slate-300"
                    )}>
                      —
                    </div>
                  ) : (
                    daySlots.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id;
                      return (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(isSelected ? null : slot)}
                          className={cn(
                            "w-full rounded-lg px-1 py-1.5 text-[11px] font-medium transition-all duration-200 sm:text-xs",
                            isSelected
                              ? isDark
                                ? "bg-brand-500 text-white shadow-lg shadow-brand-900/50 scale-105"
                                : "bg-brand-500 text-white shadow-md scale-105"
                              : isDark
                                ? "bg-brand-900/40 text-brand-200 hover:bg-brand-800/60 hover:text-white"
                                : "bg-white text-slate-700 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 hover:border-brand-300"
                          )}
                        >
                          {formatTime(slot.startTime)}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected slot details */}
      {selectedSlot && (
        <div className={cn(
          "animate-slide-up rounded-xl border-2 p-3",
          isDark
            ? "border-brand-600/50 bg-gradient-to-r from-brand-900/60 to-brand-800/60"
            : "border-brand-200 bg-gradient-to-r from-brand-50 to-teal-50"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                isDark ? "bg-brand-600/40" : "bg-brand-100"
              )}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn(isDark ? "text-brand-300" : "text-brand-600")}>
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-800")}>
                  {formatTime(selectedSlot.startTime)} – {formatTime(selectedSlot.endTime)}
                </p>
                <p className={cn("text-xs", isDark ? "text-brand-300" : "text-slate-500")}>
                  {selectedSlot.specialistTitle} {selectedSlot.specialistFirstName} {selectedSlot.specialistLastName}
                </p>
              </div>
            </div>
            <div className={cn(
              "rounded-lg px-3 py-1 text-sm font-bold",
              isDark ? "bg-teal-900/50 text-teal-300" : "bg-teal-100 text-teal-700"
            )}>
              {formatPrice(selectedSlot.priceGrosze, selectedSlot.currency)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
