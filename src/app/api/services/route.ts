import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { services, specialistServices } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const clinicId = req.nextUrl.searchParams.get("clinicId");
  const specialistId = req.nextUrl.searchParams.get("specialistId");
  const mode = req.nextUrl.searchParams.get("mode");

  if (specialistId) {
    const result = await db
      .select({ service: services })
      .from(services)
      .innerJoin(
        specialistServices,
        eq(specialistServices.serviceId, services.id)
      )
      .where(
        and(
          eq(specialistServices.specialistId, specialistId),
          eq(services.active, true),
          mode === "online" ? eq(services.onlineAvailable, true) : undefined,
          mode === "in_office" ? eq(services.inOfficeAvailable, true) : undefined
        )
      );
    return NextResponse.json(result.map((r) => r.service));
  }

  const conditions = [eq(services.active, true)];
  if (clinicId) conditions.push(eq(services.clinicId, clinicId));
  if (mode === "online") conditions.push(eq(services.onlineAvailable, true));
  if (mode === "in_office") conditions.push(eq(services.inOfficeAvailable, true));

  const all = await db
    .select()
    .from(services)
    .where(and(...conditions));
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [created] = await db.insert(services).values(body).returning();
  return NextResponse.json(created, { status: 201 });
}
