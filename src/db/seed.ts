import { db } from "./index";
import {
  clinics,
  specialists,
  services,
  specialistServices,
  timeSlots,
} from "./schema";
import { addDays, setHours, setMinutes, addMinutes } from "date-fns";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await db.delete(timeSlots);
  await db.delete(specialistServices);
  await db.delete(services);
  await db.delete(specialists);
  await db.delete(clinics);

  // Create clinic
  const [clinic] = await db
    .insert(clinics)
    .values({
      name: "Centrum Terapii Harmonia",
      slug: "harmonia",
      address: "ul. Marszałkowska 42, 00-044 Warszawa",
      phone: "+48 22 123 45 67",
      email: "recepcja@harmonia.pl",
      themeColor: "#6366F1",
    })
    .returning();

  // Create specialists
  const specialistsData = [
    {
      clinicId: clinic.id,
      firstName: "Anna",
      lastName: "Kowalska",
      title: "dr",
      specialty: "Psychoterapia poznawczo-behawioralna",
      avatarUrl: "",
    },
    {
      clinicId: clinic.id,
      firstName: "Tomasz",
      lastName: "Nowak",
      title: "mgr",
      specialty: "Terapia par i rodzin",
      avatarUrl: "",
    },
    {
      clinicId: clinic.id,
      firstName: "Maria",
      lastName: "Wiśniewska",
      title: "dr",
      specialty: "Psychiatria",
      avatarUrl: "",
    },
    {
      clinicId: clinic.id,
      firstName: "Paweł",
      lastName: "Zieliński",
      title: "mgr",
      specialty: "Psychoterapia psychodynamiczna",
      avatarUrl: "",
    },
  ];

  const insertedSpecialists = await db
    .insert(specialists)
    .values(specialistsData)
    .returning();

  // Create services
  const servicesData = [
    {
      clinicId: clinic.id,
      name: "Konsultacja psychologiczna",
      nameEn: "Psychological consultation",
      description: "Pierwsza wizyta diagnostyczna",
      descriptionEn: "Initial diagnostic session",
      durationMinutes: 50,
      priceGrosze: 25000,
      onlineAvailable: true,
      inOfficeAvailable: true,
    },
    {
      clinicId: clinic.id,
      name: "Sesja psychoterapii",
      nameEn: "Psychotherapy session",
      description: "Regularna sesja terapeutyczna",
      descriptionEn: "Regular therapy session",
      durationMinutes: 50,
      priceGrosze: 20000,
      onlineAvailable: true,
      inOfficeAvailable: true,
    },
    {
      clinicId: clinic.id,
      name: "Konsultacja psychiatryczna",
      nameEn: "Psychiatric consultation",
      description: "Wizyta u psychiatry",
      descriptionEn: "Psychiatric appointment",
      durationMinutes: 30,
      priceGrosze: 35000,
      onlineAvailable: false,
      inOfficeAvailable: true,
    },
    {
      clinicId: clinic.id,
      name: "Terapia par",
      nameEn: "Couples therapy",
      description: "Sesja terapii dla par",
      descriptionEn: "Couples therapy session",
      durationMinutes: 80,
      priceGrosze: 30000,
      onlineAvailable: true,
      inOfficeAvailable: true,
    },
    {
      clinicId: clinic.id,
      name: "Sesja EMDR",
      nameEn: "EMDR session",
      description: "Terapia EMDR",
      descriptionEn: "EMDR therapy session",
      durationMinutes: 60,
      priceGrosze: 28000,
      onlineAvailable: false,
      inOfficeAvailable: true,
    },
  ];

  const insertedServices = await db
    .insert(services)
    .values(servicesData)
    .returning();

  // Link specialists to services
  const links = [
    { specialistId: insertedSpecialists[0].id, serviceId: insertedServices[0].id },
    { specialistId: insertedSpecialists[0].id, serviceId: insertedServices[1].id },
    { specialistId: insertedSpecialists[0].id, serviceId: insertedServices[4].id },
    { specialistId: insertedSpecialists[1].id, serviceId: insertedServices[0].id },
    { specialistId: insertedSpecialists[1].id, serviceId: insertedServices[3].id },
    { specialistId: insertedSpecialists[2].id, serviceId: insertedServices[2].id },
    { specialistId: insertedSpecialists[2].id, serviceId: insertedServices[0].id },
    { specialistId: insertedSpecialists[3].id, serviceId: insertedServices[0].id },
    { specialistId: insertedSpecialists[3].id, serviceId: insertedServices[1].id },
  ];

  await db.insert(specialistServices).values(links);

  // Generate time slots for the next 14 days
  const now = new Date();
  const slotsToInsert: Array<{
    specialistId: string;
    serviceId: string;
    startTime: Date;
    endTime: Date;
    mode: "online" | "in_office";
    available: boolean;
  }> = [];

  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    const day = addDays(now, dayOffset);
    const dayOfWeek = day.getDay();
    if (dayOfWeek === 0) continue; // skip Sunday

    for (const spec of insertedSpecialists) {
      const specLinks = links.filter((l) => l.specialistId === spec.id);

      for (const link of specLinks) {
        const service = insertedServices.find((s) => s.id === link.serviceId)!;
        const hours = dayOfWeek === 6 ? [9, 10, 11] : [9, 10, 11, 13, 14, 15, 16];

        for (const hour of hours) {
          const start = setMinutes(setHours(day, hour), 0);
          const end = addMinutes(start, service.durationMinutes);
          const modes: Array<"online" | "in_office"> = [];
          if (service.onlineAvailable) modes.push("online");
          if (service.inOfficeAvailable) modes.push("in_office");

          for (const mode of modes) {
            slotsToInsert.push({
              specialistId: spec.id,
              serviceId: service.id,
              startTime: start,
              endTime: end,
              mode,
              available: Math.random() > 0.2,
            });
          }
        }
      }
    }
  }

  // Insert in batches
  const batchSize = 100;
  for (let i = 0; i < slotsToInsert.length; i += batchSize) {
    const batch = slotsToInsert.slice(i, i + batchSize);
    await db.insert(timeSlots).values(batch);
  }

  console.log(`✅ Seeded: 1 clinic, ${insertedSpecialists.length} specialists, ${insertedServices.length} services, ${slotsToInsert.length} time slots`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
