import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookings, timeSlots } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(booking);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const [updated] = await db
    .update(bookings)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(bookings.id, id))
    .returning();
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // Get booking to restore slot
  const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
  if (booking) {
    // Restore slot availability
    await db
      .update(timeSlots)
      .set({ available: true })
      .where(eq(timeSlots.id, booking.slotId));
    // Cancel booking (soft delete)
    await db
      .update(bookings)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(bookings.id, id));
  }
  return NextResponse.json({ success: true });
}
