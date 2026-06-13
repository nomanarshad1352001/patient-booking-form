import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [svc] = await db.select().from(services).where(eq(services.id, id));
  if (!svc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(svc);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const [updated] = await db
    .update(services)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(services.id, id))
    .returning();
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(services).where(eq(services.id, id));
  return NextResponse.json({ success: true });
}
