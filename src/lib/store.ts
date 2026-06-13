import { create } from "zustand";

export type VisitMode = "online" | "in_office";
export type BookingFor = "myself" | "someone_else";
export type ThemeMode = "light" | "dark";
export type Locale = "pl" | "en";

export interface ClinicData {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  themeColor: string | null;
}

export interface SpecialistData {
  id: string;
  firstName: string;
  lastName: string;
  title: string | null;
  specialty: string | null;
  avatarUrl: string | null;
}

export interface ServiceData {
  id: string;
  name: string;
  nameEn: string | null;
  description: string | null;
  descriptionEn: string | null;
  durationMinutes: number;
  priceGrosze: number;
  currency: string;
  onlineAvailable: boolean;
  inOfficeAvailable: boolean;
}

export interface SlotData {
  id: string;
  startTime: string;
  endTime: string;
  mode: VisitMode;
  specialistId: string;
  serviceId: string;
  specialistFirstName: string;
  specialistLastName: string;
  specialistTitle: string | null;
  serviceName: string;
  serviceNameEn: string | null;
  durationMinutes: number;
  priceGrosze: number;
  currency: string;
}

export interface BookingFormData {
  bookingFor: BookingFor;
  patientFirstName: string;
  patientLastName: string;
  patientEmail: string;
  patientPhone: string;
  patientDateOfBirth: string;
  patientPesel: string;
  payerFirstName: string;
  payerLastName: string;
  payerEmail: string;
  payerPhone: string;
  notes: string;
}

export type BookingStep = 1 | 2 | 3;
export type ResultScreen = "success" | "pending" | "payment_failed" | "slot_taken" | "error" | null;

interface BookingStore {
  // Theme
  theme: ThemeMode;
  locale: Locale;
  toggleTheme: () => void;
  setLocale: (l: Locale) => void;

  // Step
  step: BookingStep;
  setStep: (s: BookingStep) => void;

  // Clinic
  clinic: ClinicData | null;
  setClinic: (c: ClinicData) => void;

  // Filters
  visitMode: VisitMode;
  setVisitMode: (m: VisitMode) => void;

  selectedService: ServiceData | null;
  setSelectedService: (s: ServiceData | null) => void;

  selectedSpecialist: SpecialistData | null;
  setSelectedSpecialist: (s: SpecialistData | null) => void;

  selectedSlot: SlotData | null;
  setSelectedSlot: (s: SlotData | null) => void;

  // Form data
  formData: BookingFormData;
  setFormData: (d: Partial<BookingFormData>) => void;

  // Result
  resultScreen: ResultScreen;
  setResultScreen: (r: ResultScreen) => void;
  bookingId: string | null;
  setBookingId: (id: string | null) => void;

  // Confirmation modal
  showConfirmation: boolean;
  setShowConfirmation: (s: boolean) => void;

  // Reset
  reset: () => void;
}

const initialFormData: BookingFormData = {
  bookingFor: "myself",
  patientFirstName: "",
  patientLastName: "",
  patientEmail: "",
  patientPhone: "",
  patientDateOfBirth: "",
  patientPesel: "",
  payerFirstName: "",
  payerLastName: "",
  payerEmail: "",
  payerPhone: "",
  notes: "",
};

export const useBookingStore = create<BookingStore>((set) => ({
  theme: "light",
  locale: "pl",
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
  setLocale: (locale) => set({ locale }),

  step: 1,
  setStep: (step) => set({ step }),

  clinic: null,
  setClinic: (clinic) => set({ clinic }),

  visitMode: "in_office",
  setVisitMode: (visitMode) =>
    set({ visitMode, selectedService: null, selectedSpecialist: null, selectedSlot: null }),

  selectedService: null,
  setSelectedService: (selectedService) =>
    set({ selectedService, selectedSlot: null }),

  selectedSpecialist: null,
  setSelectedSpecialist: (selectedSpecialist) =>
    set({ selectedSpecialist, selectedSlot: null }),

  selectedSlot: null,
  setSelectedSlot: (selectedSlot) => set({ selectedSlot }),

  formData: { ...initialFormData },
  setFormData: (d) =>
    set((s) => ({ formData: { ...s.formData, ...d } })),

  resultScreen: null,
  setResultScreen: (resultScreen) => set({ resultScreen }),
  bookingId: null,
  setBookingId: (bookingId) => set({ bookingId }),

  showConfirmation: false,
  setShowConfirmation: (showConfirmation) => set({ showConfirmation }),

  reset: () =>
    set({
      step: 1,
      visitMode: "in_office",
      selectedService: null,
      selectedSpecialist: null,
      selectedSlot: null,
      formData: { ...initialFormData },
      resultScreen: null,
      bookingId: null,
      showConfirmation: false,
    }),
}));
