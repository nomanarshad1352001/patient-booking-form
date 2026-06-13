import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clinics } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [clinic] = await db.select().from(clinics).where(eq(clinics.id, id));
  if (!clinic) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(clinic);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const [updated] = await db
    .update(clinics)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(clinics.id, id))
    .returning();
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(clinics).where(eq(clinics.id, id));
  return NextResponse.json({ success: true });
}
