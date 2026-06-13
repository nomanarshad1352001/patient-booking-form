import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clinics } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const all = await db.select().from(clinics).where(eq(clinics.active, true));
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [created] = await db.insert(clinics).values(body).returning();
  return NextResponse.json(created, { status: 201 });
}
