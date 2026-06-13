"use client";

import { useEffect } from "react";
import { useBookingStore, ClinicData } from "@/lib/store";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Header } from "./Header";
import { VisitModeToggle } from "./VisitModeToggle";
import { ServiceSelector } from "./ServiceSelector";
import { SpecialistSelector } from "./SpecialistSelector";
import { TimeSlotPicker } from "./TimeSlotPicker";
import { PatientForm } from "./PatientForm";
import { ConfirmationModal } from "./ConfirmationModal";
import { ResultScreen } from "./ResultScreen";

export function BookingForm({ clinic }: { clinic: ClinicData }) {
  const {
    step,
    setStep,
    setClinic,
    selectedService,
    selectedSlot,
    formData,
    locale,
    theme,
    resultScreen,
    showConfirmation,
    setShowConfirmation,
  } = useBookingStore();
  const isDark = theme === "dark";

  useEffect(() => {
    setClinic(clinic);
  }, [clinic, setClinic]);

  const canProceedStep1 = selectedService && selectedSlot;
  const canProceedStep2 =
    formData.patientFirstName.trim() &&
    formData.patientLastName.trim() &&
    formData.patientEmail.trim() &&
    formData.patientPhone.trim() &&
    (formData.bookingFor === "myself" ||
      (formData.payerFirstName.trim() &&
        formData.payerLastName.trim() &&
        formData.payerEmail.trim() &&
        formData.payerPhone.trim()));

  if (resultScreen) {
    return (
      <div className={cn(
        "min-h-screen transition-colors duration-500",
        isDark ? "bg-brand-950" : "bg-slate-50"
      )}>
        <Header />
        <ResultScreen />
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      isDark ? "bg-brand-950" : "bg-slate-50"
    )}>
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        {/* Step 1: Visit Selection */}
        {step === 1 && (
          <div className="space-y-5 animate-slide-up">
            <VisitModeToggle />
            <ServiceSelector />
            <SpecialistSelector />
            <TimeSlotPicker />

            {/* Next button */}
            <div className="pt-2">
              <button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className={cn(
                  "group flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all duration-300",
                  canProceedStep1
                    ? isDark
                      ? "bg-gradient-to-r from-brand-500 to-teal-500 text-white shadow-lg shadow-brand-900/50 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
                      : "bg-gradient-to-r from-brand-600 to-teal-500 text-white shadow-md shadow-brand-200 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                    : isDark
                      ? "bg-brand-800/50 text-brand-500 cursor-not-allowed"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                )}
              >
                {t(locale, "nextStep")}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="transition-transform group-hover:translate-x-1"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Patient Data */}
        {step === 2 && (
          <div className="space-y-5 animate-slide-up">
            <PatientForm />

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className={cn(
                  "group flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all",
                  isDark
                    ? "bg-brand-800/50 text-brand-200 hover:bg-brand-800"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="transition-transform group-hover:-translate-x-1"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                {t(locale, "prevStep")}
              </button>
              <button
                onClick={() => {
                  setStep(3);
                  setShowConfirmation(true);
                }}
                disabled={!canProceedStep2}
                className={cn(
                  "group flex flex-[2] items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all duration-300",
                  canProceedStep2
                    ? isDark
                      ? "bg-gradient-to-r from-brand-500 to-teal-500 text-white shadow-lg shadow-brand-900/50 hover:shadow-xl hover:scale-[1.01]"
                      : "bg-gradient-to-r from-brand-600 to-teal-500 text-white shadow-md shadow-brand-200 hover:shadow-lg hover:scale-[1.01]"
                    : isDark
                      ? "bg-brand-800/50 text-brand-500 cursor-not-allowed"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                )}
              >
                {t(locale, "nextStep")}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="transition-transform group-hover:translate-x-1"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Step 3 shows the confirmation modal */}
        {step === 3 && !showConfirmation && !resultScreen && (
          <div className="space-y-5 animate-slide-up">
            <div className={cn(
              "rounded-xl border-2 p-6 text-center",
              isDark ? "border-brand-700 bg-brand-900/40" : "border-slate-200 bg-white"
            )}>
              <p className={cn("text-sm", isDark ? "text-brand-300" : "text-slate-500")}>
                {locale === "pl" ? "Kliknij przycisk aby potwierdzić rezerwację" : "Click the button to confirm your booking"}
              </p>
              <button
                onClick={() => setShowConfirmation(true)}
                className={cn(
                  "mt-4 rounded-xl px-8 py-3 text-sm font-bold transition-all hover:scale-[1.02]",
                  isDark
                    ? "bg-gradient-to-r from-brand-500 to-teal-500 text-white shadow-lg"
                    : "bg-gradient-to-r from-brand-600 to-teal-500 text-white shadow-md"
                )}
              >
                {t(locale, "confirmBooking")}
              </button>
              <button
                onClick={() => setStep(2)}
                className={cn(
                  "mt-3 block w-full text-sm font-medium transition-colors",
                  isDark ? "text-brand-400 hover:text-brand-300" : "text-slate-500 hover:text-slate-700"
                )}
              >
                ← {t(locale, "prevStep")}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal />

      {/* Footer */}
      <footer className={cn(
        "mt-8 border-t py-4 text-center text-xs",
        isDark ? "border-brand-800 text-brand-600" : "border-slate-200 text-slate-400"
      )}>
        <a href="/admin" className={cn(
          "hover:underline transition-colors",
          isDark ? "hover:text-brand-400" : "hover:text-slate-600"
        )}>
          {t(locale, "admin")} →
        </a>
      </footer>
    </div>
  );
}
