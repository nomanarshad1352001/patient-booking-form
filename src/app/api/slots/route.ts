import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { timeSlots, specialists, services } from "@/db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const specialistId = req.nextUrl.searchParams.get("specialistId");
  const serviceId = req.nextUrl.searchParams.get("serviceId");
  const mode = req.nextUrl.searchParams.get("mode");
  const dateFrom = req.nextUrl.searchParams.get("dateFrom");
  const dateTo = req.nextUrl.searchParams.get("dateTo");

  const conditions = [eq(timeSlots.available, true)];

  if (specialistId) conditions.push(eq(timeSlots.specialistId, specialistId));
  if (serviceId) conditions.push(eq(timeSlots.serviceId, serviceId));
  if (mode === "online" || mode === "in_office") {
    conditions.push(eq(timeSlots.mode, mode));
  }
  if (dateFrom) conditions.push(gte(timeSlots.startTime, new Date(dateFrom)));
  if (dateTo) conditions.push(lte(timeSlots.startTime, new Date(dateTo)));

  // Always filter future slots only
  conditions.push(gte(timeSlots.startTime, new Date()));

  const slots = await db
    .select({
      id: timeSlots.id,
      startTime: timeSlots.startTime,
      endTime: timeSlots.endTime,
      mode: timeSlots.mode,
      available: timeSlots.available,
      specialistId: timeSlots.specialistId,
      serviceId: timeSlots.serviceId,
      specialistFirstName: specialists.firstName,
      specialistLastName: specialists.lastName,
      specialistTitle: specialists.title,
      serviceName: services.name,
      serviceNameEn: services.nameEn,
      durationMinutes: services.durationMinutes,
      priceGrosze: services.priceGrosze,
      currency: services.currency,
    })
    .from(timeSlots)
    .innerJoin(specialists, eq(timeSlots.specialistId, specialists.id))
    .innerJoin(services, eq(timeSlots.serviceId, services.id))
    .where(and(...conditions))
    .orderBy(timeSlots.startTime)
    .limit(200);

  return NextResponse.json(slots);
}
