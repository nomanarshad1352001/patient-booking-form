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
      "relative min-h-screen overflow-hidden transition-colors duration-500",
      isDark
        ? "bg-[radial-gradient(circle_at_top_left,#312e81_0%,#1e1b4b_32%,#020617_100%)]"
        : "bg-[radial-gradient(circle_at_top_left,#eef2ff_0%,#f8fafc_38%,#ecfeff_100%)]"
    )}>
      <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "url('/images/hero-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className={cn("pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full blur-3xl", isDark ? "bg-brand-500/20" : "bg-brand-300/40")} />
      <div className={cn("pointer-events-none absolute -right-24 top-96 h-80 w-80 rounded-full blur-3xl", isDark ? "bg-teal-400/10" : "bg-teal-300/40")} />
      <div className="relative z-10">
        <Header />

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <section className={cn(
          "mb-6 overflow-hidden rounded-3xl border p-5 shadow-xl backdrop-blur-md animate-slide-up",
          isDark ? "border-white/10 bg-brand-950/55 shadow-black/20" : "border-white/80 bg-white/75 shadow-brand-100/60"
        )}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className={cn("text-xs font-bold uppercase tracking-[0.2em]", isDark ? "text-teal-300" : "text-teal-600")}>Prototype booking flow</p>
              <h2 className={cn("mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl", isDark ? "text-white" : "text-slate-950")}>{clinic.name}</h2>
              <p className={cn("mt-2 max-w-xl text-sm leading-6", isDark ? "text-brand-200" : "text-slate-600")}>Choose a visit, enter patient details, and confirm the appointment in a polished, fully clickable dummy-data prototype.</p>
            </div>
            <div className={cn("grid grid-cols-3 gap-2 rounded-2xl p-2 text-center", isDark ? "bg-white/5" : "bg-white/70")}>
              {["2 themes", "PL / EN", "CRUD"].map((label) => (
                <div key={label} className={cn("rounded-xl px-3 py-2 text-xs font-bold", isDark ? "bg-brand-800/60 text-brand-100" : "bg-brand-50 text-brand-700")}>{label}</div>
              ))}
            </div>
          </div>
        </section>
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
    </div>
  );
}
