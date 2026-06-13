import { addDays, addMinutes, endOfWeek, setHours, setMinutes, startOfWeek } from "date-fns";
import type { ClinicData, ServiceData, SpecialistData, SlotData, VisitMode } from "@/lib/store";

export const dummyClinic: ClinicData = {
  id: "clinic-harmonia",
  name: "Centrum Terapii Harmonia",
  slug: "harmonia",
  address: "ul. Marszałkowska 42, 00-044 Warszawa",
  phone: "+48 22 123 45 67",
  email: "recepcja@harmonia.pl",
  themeColor: "#6366F1",
};

export const dummySpecialists: SpecialistData[] = [
  {
    id: "spec-anna",
    firstName: "Anna",
    lastName: "Kowalska",
    title: "dr",
    specialty: "Psychoterapia poznawczo-behawioralna",
    avatarUrl: null,
  },
  {
    id: "spec-tomasz",
    firstName: "Tomasz",
    lastName: "Nowak",
    title: "mgr",
    specialty: "Terapia par i rodzin",
    avatarUrl: null,
  },
  {
    id: "spec-maria",
    firstName: "Maria",
    lastName: "Wiśniewska",
    title: "dr",
    specialty: "Psychiatria i farmakoterapia",
    avatarUrl: null,
  },
  {
    id: "spec-pawel",
    firstName: "Paweł",
    lastName: "Zieliński",
    title: "mgr",
    specialty: "Psychoterapia psychodynamiczna",
    avatarUrl: null,
  },
];

export const dummyServices: ServiceData[] = [
  {
    id: "svc-consultation",
    name: "Konsultacja psychologiczna",
    nameEn: "Psychological consultation",
    description: "Pierwsza wizyta diagnostyczna i plan terapii",
    descriptionEn: "Initial diagnostic visit and therapy plan",
    durationMinutes: 50,
    priceGrosze: 25000,
    currency: "PLN",
    onlineAvailable: true,
    inOfficeAvailable: true,
  },
  {
    id: "svc-therapy",
    name: "Sesja psychoterapii",
    nameEn: "Psychotherapy session",
    description: "Regularna indywidualna sesja terapeutyczna",
    descriptionEn: "Regular individual therapy session",
    durationMinutes: 50,
    priceGrosze: 20000,
    currency: "PLN",
    onlineAvailable: true,
    inOfficeAvailable: true,
  },
  {
    id: "svc-psychiatry",
    name: "Konsultacja psychiatryczna",
    nameEn: "Psychiatric consultation",
    description: "Wizyta u lekarza psychiatry",
    descriptionEn: "Appointment with a psychiatrist",
    durationMinutes: 30,
    priceGrosze: 35000,
    currency: "PLN",
    onlineAvailable: false,
    inOfficeAvailable: true,
  },
  {
    id: "svc-couples",
    name: "Terapia par",
    nameEn: "Couples therapy",
    description: "Sesja dla par prowadzona przez terapeutę rodzinnego",
    descriptionEn: "Couples session with a family therapist",
    durationMinutes: 80,
    priceGrosze: 30000,
    currency: "PLN",
    onlineAvailable: true,
    inOfficeAvailable: true,
  },
  {
    id: "svc-emdr",
    name: "Sesja EMDR",
    nameEn: "EMDR session",
    description: "Terapia traumy metodą EMDR",
    descriptionEn: "EMDR trauma therapy",
    durationMinutes: 60,
    priceGrosze: 28000,
    currency: "PLN",
    onlineAvailable: false,
    inOfficeAvailable: true,
  },
];

export const dummySpecialistServices: Record<string, string[]> = {
  "spec-anna": ["svc-consultation", "svc-therapy", "svc-emdr"],
  "spec-tomasz": ["svc-consultation", "svc-couples"],
  "spec-maria": ["svc-consultation", "svc-psychiatry"],
  "spec-pawel": ["svc-consultation", "svc-therapy"],
};

export interface DummyBooking {
  id: string;
  clinicId: string;
  specialistId: string;
  serviceId: string;
  slotId: string;
  bookingFor: "myself" | "someone_else";
  patientFirstName: string;
  patientLastName: string;
  patientEmail: string;
  patientPhone: string;
  patientDateOfBirth?: string;
  patientPesel?: string;
  payerFirstName?: string | null;
  payerLastName?: string | null;
  payerEmail?: string | null;
  payerPhone?: string | null;
  mode: VisitMode;
  notes?: string | null;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "payment_failed" | "slot_taken";
  totalGrosze: number;
  currency: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
}

function buildSlots(): SlotData[] {
  const slots: SlotData[] = [];
  const now = new Date();
  const baseWeek = startOfWeek(now, { weekStartsOn: 1 });

  for (let dayOffset = 0; dayOffset < 28; dayOffset++) {
    const day = addDays(baseWeek, dayOffset);
    const dayOfWeek = day.getDay();
    if (dayOfWeek === 0) continue;

    for (const specialist of dummySpecialists) {
      const serviceIds = dummySpecialistServices[specialist.id] ?? [];

      for (const serviceId of serviceIds) {
        const service = dummyServices.find((s) => s.id === serviceId);
        if (!service) continue;

        const hours = dayOfWeek === 6 ? [9, 10, 11] : [9, 10, 11, 13, 14, 15, 16, 17];
        const modes: VisitMode[] = [];
        if (service.onlineAvailable) modes.push("online");
        if (service.inOfficeAvailable) modes.push("in_office");

        for (const hour of hours) {
          const start = setMinutes(setHours(day, hour), 0);
          const end = addMinutes(start, service.durationMinutes);
          if (start < now) continue;

          for (const mode of modes) {
            const availabilityHash = `${dayOffset}-${hour}-${specialist.id}-${service.id}-${mode}`.length;
            if ((availabilityHash + hour + dayOffset) % 5 === 0) continue;

            slots.push({
              id: `slot-${dayOffset}-${hour}-${specialist.id}-${service.id}-${mode}`,
              startTime: start.toISOString(),
              endTime: end.toISOString(),
              mode,
              specialistId: specialist.id,
              serviceId: service.id,
              specialistFirstName: specialist.firstName,
              specialistLastName: specialist.lastName,
              specialistTitle: specialist.title,
              serviceName: service.name,
              serviceNameEn: service.nameEn,
              durationMinutes: service.durationMinutes,
              priceGrosze: service.priceGrosze,
              currency: service.currency,
            });
          }
        }
      }
    }
  }

  return slots.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
}

export const dummySlots = buildSlots();

export const dummyBookings: DummyBooking[] = [
  {
    id: "BK-DEMO-001",
    clinicId: dummyClinic.id,
    specialistId: "spec-anna",
    serviceId: "svc-consultation",
    slotId: dummySlots[0]?.id ?? "demo-slot",
    bookingFor: "myself",
    patientFirstName: "Julia",
    patientLastName: "Wójcik",
    patientEmail: "julia@example.com",
    patientPhone: "+48 501 234 567",
    patientDateOfBirth: "1993-04-12",
    patientPesel: "",
    payerFirstName: null,
    payerLastName: null,
    payerEmail: null,
    payerPhone: null,
    mode: "in_office",
    notes: "Preferuję spokojny gabinet.",
    status: "confirmed",
    totalGrosze: 25000,
    currency: "PLN",
    locale: "pl",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "BK-DEMO-002",
    clinicId: dummyClinic.id,
    specialistId: "spec-tomasz",
    serviceId: "svc-couples",
    slotId: dummySlots[10]?.id ?? "demo-slot-2",
    bookingFor: "someone_else",
    patientFirstName: "Adam",
    patientLastName: "Kaczmarek",
    patientEmail: "adam@example.com",
    patientPhone: "+48 600 100 200",
    payerFirstName: "Ewa",
    payerLastName: "Kaczmarek",
    payerEmail: "ewa@example.com",
    payerPhone: "+48 600 300 400",
    mode: "online",
    notes: null,
    status: "pending",
    totalGrosze: 30000,
    currency: "PLN",
    locale: "pl",
    createdAt: addDays(new Date(), -1).toISOString(),
    updatedAt: addDays(new Date(), -1).toISOString(),
  },
];

export function getFilteredServices(params: { specialistId?: string | null; mode?: string | null }) {
  let result = [...dummyServices];
  if (params.specialistId) {
    const allowed = dummySpecialistServices[params.specialistId] ?? [];
    result = result.filter((service) => allowed.includes(service.id));
  }
  if (params.mode === "online") result = result.filter((service) => service.onlineAvailable);
  if (params.mode === "in_office") result = result.filter((service) => service.inOfficeAvailable);
  return result;
}

export function getFilteredSpecialists(params: { serviceId?: string | null }) {
  if (!params.serviceId) return [...dummySpecialists];
  return dummySpecialists.filter((specialist) =>
    (dummySpecialistServices[specialist.id] ?? []).includes(params.serviceId as string)
  );
}

export function getFilteredSlots(params: {
  specialistId?: string | null;
  serviceId?: string | null;
  mode?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
}) {
  return dummySlots.filter((slot) => {
    if (params.specialistId && slot.specialistId !== params.specialistId) return false;
    if (params.serviceId && slot.serviceId !== params.serviceId) return false;
    if (params.mode && slot.mode !== params.mode) return false;
    if (params.dateFrom && new Date(slot.startTime) < new Date(params.dateFrom)) return false;
    if (params.dateTo && new Date(slot.startTime) > new Date(params.dateTo)) return false;
    return true;
  });
}
