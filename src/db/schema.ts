import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";

// ── Enums ──
export const visitModeEnum = pgEnum("visit_mode", ["online", "in_office"]);
export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
  "payment_failed",
  "slot_taken",
]);
export const bookingForEnum = pgEnum("booking_for", ["myself", "someone_else"]);

// ── Clinics ──
export const clinics = pgTable("clinics", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  address: text("address"),
  phone: varchar("phone", { length: 32 }),
  email: varchar("email", { length: 255 }),
  logoUrl: text("logo_url"),
  themeColor: varchar("theme_color", { length: 7 }).default("#6366F1"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Specialists (therapists, doctors) ──
export const specialists = pgTable("specialists", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .references(() => clinics.id, { onDelete: "cascade" })
    .notNull(),
  firstName: varchar("first_name", { length: 128 }).notNull(),
  lastName: varchar("last_name", { length: 128 }).notNull(),
  title: varchar("title", { length: 64 }),
  specialty: varchar("specialty", { length: 255 }),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Services ──
export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .references(() => clinics.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  nameEn: varchar("name_en", { length: 255 }),
  description: text("description"),
  descriptionEn: text("description_en"),
  durationMinutes: integer("duration_minutes").notNull().default(50),
  priceGrosze: integer("price_grosze").notNull().default(0),
  currency: varchar("currency", { length: 3 }).default("PLN").notNull(),
  onlineAvailable: boolean("online_available").default(true).notNull(),
  inOfficeAvailable: boolean("in_office_available").default(true).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Specialist ↔ Service join ──
export const specialistServices = pgTable("specialist_services", {
  id: uuid("id").defaultRandom().primaryKey(),
  specialistId: uuid("specialist_id")
    .references(() => specialists.id, { onDelete: "cascade" })
    .notNull(),
  serviceId: uuid("service_id")
    .references(() => services.id, { onDelete: "cascade" })
    .notNull(),
});

// ── Time Slots ──
export const timeSlots = pgTable("time_slots", {
  id: uuid("id").defaultRandom().primaryKey(),
  specialistId: uuid("specialist_id")
    .references(() => specialists.id, { onDelete: "cascade" })
    .notNull(),
  serviceId: uuid("service_id")
    .references(() => services.id, { onDelete: "cascade" })
    .notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  mode: visitModeEnum("mode").notNull().default("in_office"),
  available: boolean("available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Bookings ──
export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .references(() => clinics.id, { onDelete: "cascade" })
    .notNull(),
  specialistId: uuid("specialist_id")
    .references(() => specialists.id, { onDelete: "cascade" })
    .notNull(),
  serviceId: uuid("service_id")
    .references(() => services.id, { onDelete: "cascade" })
    .notNull(),
  slotId: uuid("slot_id")
    .references(() => timeSlots.id)
    .notNull(),
  bookingFor: bookingForEnum("booking_for").notNull().default("myself"),
  // Patient (the person receiving care)
  patientFirstName: varchar("patient_first_name", { length: 128 }).notNull(),
  patientLastName: varchar("patient_last_name", { length: 128 }).notNull(),
  patientEmail: varchar("patient_email", { length: 255 }).notNull(),
  patientPhone: varchar("patient_phone", { length: 32 }).notNull(),
  patientDateOfBirth: varchar("patient_date_of_birth", { length: 12 }),
  patientPesel: varchar("patient_pesel", { length: 11 }),
  // Payer (may differ from patient)
  payerFirstName: varchar("payer_first_name", { length: 128 }),
  payerLastName: varchar("payer_last_name", { length: 128 }),
  payerEmail: varchar("payer_email", { length: 255 }),
  payerPhone: varchar("payer_phone", { length: 32 }),
  mode: visitModeEnum("mode").notNull().default("in_office"),
  notes: text("notes"),
  status: bookingStatusEnum("status").notNull().default("pending"),
  totalGrosze: integer("total_grosze").notNull().default(0),
  currency: varchar("currency", { length: 3 }).default("PLN").notNull(),
  locale: varchar("locale", { length: 5 }).default("pl").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Type exports ──
export type Clinic = typeof clinics.$inferSelect;
export type NewClinic = typeof clinics.$inferInsert;
export type Specialist = typeof specialists.$inferSelect;
export type NewSpecialist = typeof specialists.$inferInsert;
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type TimeSlot = typeof timeSlots.$inferSelect;
export type NewTimeSlot = typeof timeSlots.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
