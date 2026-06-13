import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { specialists } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [spec] = await db.select().from(specialists).where(eq(specialists.id, id));
  if (!spec) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(spec);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const [updated] = await db
    .update(specialists)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(specialists.id, id))
    .returning();
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(specialists).where(eq(specialists.id, id));
  return NextResponse.json({ success: true });
}
