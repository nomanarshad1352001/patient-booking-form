import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { specialists, specialistServices, services } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const clinicId = req.nextUrl.searchParams.get("clinicId");
  const serviceId = req.nextUrl.searchParams.get("serviceId");

  if (serviceId) {
    // Get specialists that offer a specific service
    const result = await db
      .select({
        specialist: specialists,
      })
      .from(specialists)
      .innerJoin(
        specialistServices,
        eq(specialistServices.specialistId, specialists.id)
      )
      .where(
        and(
          eq(specialistServices.serviceId, serviceId),
          eq(specialists.active, true),
          clinicId ? eq(specialists.clinicId, clinicId) : undefined
        )
      );
    return NextResponse.json(result.map((r) => r.specialist));
  }

  const conditions = [eq(specialists.active, true)];
  if (clinicId) conditions.push(eq(specialists.clinicId, clinicId));

  const all = await db
    .select()
    .from(specialists)
    .where(and(...conditions));
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { serviceIds, ...specialistData } = body;
  const [created] = await db.insert(specialists).values(specialistData).returning();

  if (serviceIds && Array.isArray(serviceIds)) {
    await db.insert(specialistServices).values(
      serviceIds.map((sid: string) => ({
        specialistId: created.id,
        serviceId: sid,
      }))
    );
  }

  return NextResponse.json(created, { status: 201 });
}
