"use client";

import { useBookingStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  required,
  isDark,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  required?: boolean;
  isDark: boolean;
}) {
  return (
    <div>
      <label className={cn(
        "mb-1 block text-xs font-semibold",
        isDark ? "text-brand-200" : "text-slate-600"
      )}>
        {label} {required && <span className="text-error">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border-2 px-3.5 py-2.5 text-sm transition-all duration-200 outline-none",
          error
            ? "border-error/50 bg-error/5 focus:border-error"
            : isDark
              ? "border-brand-800/50 bg-brand-950/40 text-white placeholder:text-brand-600 focus:border-brand-500 focus:bg-brand-900/60"
              : "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:bg-brand-50/30"
        )}
      />
      {error && (
        <p className="mt-1 text-xs text-error animate-slide-down">{error}</p>
      )}
    </div>
  );
}

export function PatientForm() {
  const { formData, setFormData, locale, theme } = useBookingStore();
  const isDark = theme === "dark";

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Booking for toggle */}
      <div>
        <label className={cn(
          "mb-2 block text-sm font-semibold",
          isDark ? "text-brand-200" : "text-slate-700"
        )}>
          {t(locale, "patientData")}
        </label>
        <div className={cn(
          "flex rounded-xl p-1",
          isDark ? "bg-brand-900/50" : "bg-brand-50"
        )}>
          {(["myself", "someone_else"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFormData({ bookingFor: mode })}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300",
                formData.bookingFor === mode
                  ? isDark
                    ? "bg-brand-600 text-white shadow-lg"
                    : "bg-white text-brand-700 shadow-md"
                  : isDark
                    ? "text-brand-300 hover:text-white"
                    : "text-brand-400 hover:text-brand-600"
              )}
            >
              {mode === "myself" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              )}
              {t(locale, mode === "myself" ? "forMyself" : "forSomeoneElse")}
            </button>
          ))}
        </div>
      </div>

      {/* Patient fields */}
      <div className={cn(
        "rounded-xl border-2 p-4 space-y-4",
        isDark ? "border-brand-800/50 bg-brand-950/30" : "border-slate-200 bg-white"
      )}>
        <div className="flex items-center gap-2 mb-3">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            isDark ? "bg-brand-800/50" : "bg-brand-100"
          )}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn(isDark ? "text-brand-400" : "text-brand-600")}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h3 className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-700")}>
            {formData.bookingFor === "someone_else" ? t(locale, "patientData") : t(locale, "patientData")}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label={t(locale, "firstName")}
            value={formData.patientFirstName}
            onChange={(v) => setFormData({ patientFirstName: v })}
            required
            isDark={isDark}
          />
          <FormInput
            label={t(locale, "lastName")}
            value={formData.patientLastName}
            onChange={(v) => setFormData({ patientLastName: v })}
            required
            isDark={isDark}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label={t(locale, "email")}
            type="email"
            value={formData.patientEmail}
            onChange={(v) => setFormData({ patientEmail: v })}
            placeholder="jan@email.pl"
            required
            isDark={isDark}
          />
          <FormInput
            label={t(locale, "phone")}
            type="tel"
            value={formData.patientPhone}
            onChange={(v) => setFormData({ patientPhone: v })}
            placeholder="+48 123 456 789"
            required
            isDark={isDark}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label={t(locale, "dateOfBirth")}
            type="date"
            value={formData.patientDateOfBirth}
            onChange={(v) => setFormData({ patientDateOfBirth: v })}
            isDark={isDark}
          />
          <FormInput
            label={t(locale, "pesel")}
            value={formData.patientPesel}
            onChange={(v) => setFormData({ patientPesel: v })}
            placeholder="12345678901"
            isDark={isDark}
          />
        </div>
      </div>

      {/* Payer fields (when booking for someone else) */}
      {formData.bookingFor === "someone_else" && (
        <div className={cn(
          "animate-slide-up rounded-xl border-2 p-4 space-y-4",
          isDark ? "border-teal-800/50 bg-teal-950/20" : "border-teal-200 bg-teal-50/30"
        )}>
          <div className="flex items-center gap-2 mb-3">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              isDark ? "bg-teal-800/50" : "bg-teal-100"
            )}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn(isDark ? "text-teal-400" : "text-teal-600")}>
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <h3 className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-700")}>
              {t(locale, "payerData")}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label={t(locale, "firstName")}
              value={formData.payerFirstName}
              onChange={(v) => setFormData({ payerFirstName: v })}
              required
              isDark={isDark}
            />
            <FormInput
              label={t(locale, "lastName")}
              value={formData.payerLastName}
              onChange={(v) => setFormData({ payerLastName: v })}
              required
              isDark={isDark}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label={t(locale, "email")}
              type="email"
              value={formData.payerEmail}
              onChange={(v) => setFormData({ payerEmail: v })}
              required
              isDark={isDark}
            />
            <FormInput
              label={t(locale, "phone")}
              type="tel"
              value={formData.payerPhone}
              onChange={(v) => setFormData({ payerPhone: v })}
              required
              isDark={isDark}
            />
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className={cn(
          "mb-1 block text-xs font-semibold",
          isDark ? "text-brand-200" : "text-slate-600"
        )}>
          {t(locale, "notes")}
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ notes: e.target.value })}
          placeholder={t(locale, "notesPlaceholder")}
          rows={3}
          className={cn(
            "w-full rounded-xl border-2 px-3.5 py-2.5 text-sm transition-all duration-200 outline-none resize-none",
            isDark
              ? "border-brand-800/50 bg-brand-950/40 text-white placeholder:text-brand-600 focus:border-brand-500"
              : "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-brand-500"
          )}
        />
      </div>
    </div>
  );
}
