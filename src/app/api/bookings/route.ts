import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookings, timeSlots } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const clinicId = req.nextUrl.searchParams.get("clinicId");
  const status = req.nextUrl.searchParams.get("status");

  const conditions = [];
  if (clinicId) conditions.push(eq(bookings.clinicId, clinicId));
  if (status) {
    const validStatuses = ["pending", "confirmed", "cancelled", "completed", "payment_failed", "slot_taken"] as const;
    const s = validStatuses.find((v) => v === status);
    if (s) conditions.push(eq(bookings.status, s));
  }

  const all = await db
    .select()
    .from(bookings)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(bookings.createdAt))
    .limit(100);

  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Check slot availability first
  const [slot] = await db
    .select()
    .from(timeSlots)
    .where(eq(timeSlots.id, body.slotId));

  if (!slot) {
    return NextResponse.json({ error: "Slot not found", code: "SLOT_NOT_FOUND" }, { status: 404 });
  }

  if (!slot.available) {
    return NextResponse.json({ error: "Slot already taken", code: "SLOT_TAKEN" }, { status: 409 });
  }

  // Mark slot as unavailable
  await db
    .update(timeSlots)
    .set({ available: false })
    .where(eq(timeSlots.id, body.slotId));

  // Create booking
  const [booking] = await db
    .insert(bookings)
    .values({
      clinicId: body.clinicId,
      specialistId: body.specialistId,
      serviceId: body.serviceId,
      slotId: body.slotId,
      bookingFor: body.bookingFor || "myself",
      patientFirstName: body.patientFirstName,
      patientLastName: body.patientLastName,
      patientEmail: body.patientEmail,
      patientPhone: body.patientPhone,
      patientDateOfBirth: body.patientDateOfBirth,
      patientPesel: body.patientPesel,
      payerFirstName: body.payerFirstName,
      payerLastName: body.payerLastName,
      payerEmail: body.payerEmail,
      payerPhone: body.payerPhone,
      mode: body.mode || "in_office",
      notes: body.notes,
      status: "confirmed",
      totalGrosze: body.totalGrosze || 0,
      currency: body.currency || "PLN",
      locale: body.locale || "pl",
    })
    .returning();

  return NextResponse.json(booking, { status: 201 });
}
