"use client";

import { useBookingStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { cn, formatPrice, formatTime, formatDate } from "@/lib/utils";
import { useState } from "react";

export function ConfirmationModal() {
  const {
    showConfirmation,
    setShowConfirmation,
    selectedSlot,
    selectedService,
    formData,
    locale,
    theme,
    clinic,
    visitMode,
    setResultScreen,
    setBookingId,
    setStep,
  } = useBookingStore();
  const isDark = theme === "dark";
  const [submitting, setSubmitting] = useState(false);

  if (!showConfirmation || !selectedSlot || !selectedService) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicId: clinic?.id,
          specialistId: selectedSlot.specialistId,
          serviceId: selectedSlot.serviceId,
          slotId: selectedSlot.id,
          bookingFor: formData.bookingFor,
          patientFirstName: formData.patientFirstName,
          patientLastName: formData.patientLastName,
          patientEmail: formData.patientEmail,
          patientPhone: formData.patientPhone,
          patientDateOfBirth: formData.patientDateOfBirth,
          patientPesel: formData.patientPesel,
          payerFirstName: formData.bookingFor === "someone_else" ? formData.payerFirstName : undefined,
          payerLastName: formData.bookingFor === "someone_else" ? formData.payerLastName : undefined,
          payerEmail: formData.bookingFor === "someone_else" ? formData.payerEmail : undefined,
          payerPhone: formData.bookingFor === "someone_else" ? formData.payerPhone : undefined,
          mode: visitMode,
          notes: formData.notes,
          totalGrosze: selectedSlot.priceGrosze,
          currency: selectedSlot.currency,
          locale,
        }),
      });

      if (res.ok) {
        const booking = await res.json();
        setBookingId(booking.id);
        setResultScreen("success");
      } else {
        const err = await res.json();
        if (err.code === "SLOT_TAKEN") {
          setResultScreen("slot_taken");
        } else {
          setResultScreen("error");
        }
      }
    } catch {
      setResultScreen("error");
    } finally {
      setSubmitting(false);
      setShowConfirmation(false);
    }
  };

  const serviceName = locale === "en" && selectedService.nameEn ? selectedService.nameEn : selectedService.name;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !submitting && setShowConfirmation(false)}
      />

      {/* Modal */}
      <div className={cn(
        "relative w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-scale-in",
        isDark ? "bg-brand-900 border border-brand-700" : "bg-white"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={cn(
            "text-xl font-bold",
            isDark ? "text-white" : "text-slate-800"
          )}>
            {t(locale, "confirmBooking")}
          </h2>
          <button
            onClick={() => !submitting && setShowConfirmation(false)}
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              isDark ? "text-brand-400 hover:bg-brand-800" : "text-slate-400 hover:bg-slate-100"
            )}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Summary card */}
        <div className={cn(
          "rounded-xl border-2 p-4 mb-4 space-y-3",
          isDark ? "border-brand-700 bg-brand-950/50" : "border-slate-200 bg-slate-50"
        )}>
          <h3 className={cn(
            "text-sm font-semibold",
            isDark ? "text-brand-300" : "text-slate-500"
          )}>
            {t(locale, "visitSummary")}
          </h3>

          <div className="space-y-2.5">
            <SummaryRow
              icon="💼"
              label={t(locale, "service")}
              value={serviceName}
              isDark={isDark}
            />
            <SummaryRow
              icon="👤"
              label={t(locale, "specialist")}
              value={`${selectedSlot.specialistTitle || ""} ${selectedSlot.specialistFirstName} ${selectedSlot.specialistLastName}`}
              isDark={isDark}
            />
            <SummaryRow
              icon="📅"
              label={t(locale, "date")}
              value={formatDate(selectedSlot.startTime, locale)}
              isDark={isDark}
            />
            <SummaryRow
              icon="🕐"
              label={t(locale, "time")}
              value={`${formatTime(selectedSlot.startTime)} – ${formatTime(selectedSlot.endTime)}`}
              isDark={isDark}
            />
            <SummaryRow
              icon={visitMode === "online" ? "💻" : "🏥"}
              label={t(locale, "mode")}
              value={t(locale, visitMode === "online" ? "online" : "inOffice")}
              isDark={isDark}
            />
          </div>

          <div className={cn(
            "mt-3 border-t pt-3",
            isDark ? "border-brand-700" : "border-slate-200"
          )}>
            <SummaryRow
              icon="🧑"
              label={t(locale, "patient")}
              value={`${formData.patientFirstName} ${formData.patientLastName}`}
              isDark={isDark}
            />
            {formData.bookingFor === "someone_else" && (
              <div className="mt-2">
                <SummaryRow
                  icon="💳"
                  label={t(locale, "payer")}
                  value={`${formData.payerFirstName} ${formData.payerLastName}`}
                  isDark={isDark}
                />
              </div>
            )}
          </div>
        </div>

        {/* Total */}
        <div className={cn(
          "flex items-center justify-between rounded-xl p-4 mb-6",
          isDark
            ? "bg-gradient-to-r from-brand-800/80 to-teal-900/60"
            : "bg-gradient-to-r from-brand-50 to-teal-50"
        )}>
          <span className={cn("text-sm font-semibold", isDark ? "text-brand-200" : "text-slate-600")}>
            {t(locale, "total")}
          </span>
          <span className={cn("text-2xl font-bold", isDark ? "text-white" : "text-brand-700")}>
            {formatPrice(selectedSlot.priceGrosze, selectedSlot.currency)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowConfirmation(false);
              setStep(2);
            }}
            disabled={submitting}
            className={cn(
              "flex-1 rounded-xl py-3 text-sm font-semibold transition-all",
              isDark
                ? "bg-brand-800/50 text-brand-200 hover:bg-brand-800"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {t(locale, "edit")}
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className={cn(
              "flex flex-[2] items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all",
              submitting
                ? "opacity-70 cursor-wait"
                : "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
              isDark
                ? "bg-gradient-to-r from-brand-500 to-teal-500 text-white shadow-lg shadow-brand-900/50"
                : "bg-gradient-to-r from-brand-600 to-teal-500 text-white shadow-md shadow-brand-200"
            )}
          >
            {submitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t(locale, "confirm")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  isDark,
}: {
  icon: string;
  label: string;
  value: string;
  isDark: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-sm">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className={cn("text-xs", isDark ? "text-brand-400" : "text-slate-400")}>
          {label}
        </p>
        <p className={cn("text-sm font-medium truncate", isDark ? "text-white" : "text-slate-800")}>
          {value}
        </p>
      </div>
    </div>
  );
}
