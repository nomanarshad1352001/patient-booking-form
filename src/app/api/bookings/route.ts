import { NextRequest, NextResponse } from "next/server";
import { dummyBookings, dummyClinic, dummySlots, type DummyBooking } from "@/lib/dummy-data";

const prototypeBookings = dummyBookings;

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  const result = status
    ? prototypeBookings.filter((booking) => booking.status === status)
    : prototypeBookings;

  return NextResponse.json(
    [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const slot = dummySlots.find((item) => item.id === body.slotId);

  if (!slot) {
    return NextResponse.json({ error: "Slot not found", code: "SLOT_NOT_FOUND" }, { status: 404 });
  }

  const alreadyBooked = prototypeBookings.some(
    (booking) => booking.slotId === body.slotId && booking.status !== "cancelled"
  );

  if (alreadyBooked) {
    return NextResponse.json({ error: "Slot already taken", code: "SLOT_TAKEN" }, { status: 409 });
  }

  const now = new Date().toISOString();
  const booking: DummyBooking = {
    id: `BK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    clinicId: body.clinicId ?? dummyClinic.id,
    specialistId: body.specialistId,
    serviceId: body.serviceId,
    slotId: body.slotId,
    bookingFor: body.bookingFor ?? "myself",
    patientFirstName: body.patientFirstName,
    patientLastName: body.patientLastName,
    patientEmail: body.patientEmail,
    patientPhone: body.patientPhone,
    patientDateOfBirth: body.patientDateOfBirth,
    patientPesel: body.patientPesel,
    payerFirstName: body.payerFirstName ?? null,
    payerLastName: body.payerLastName ?? null,
    payerEmail: body.payerEmail ?? null,
    payerPhone: body.payerPhone ?? null,
    mode: body.mode ?? "in_office",
    notes: body.notes ?? null,
    status: "confirmed",
    totalGrosze: body.totalGrosze ?? slot.priceGrosze,
    currency: body.currency ?? slot.currency,
    locale: body.locale ?? "pl",
    createdAt: now,
    updatedAt: now,
  };

  prototypeBookings.unshift(booking);
  return NextResponse.json(booking, { status: 201 });
}
