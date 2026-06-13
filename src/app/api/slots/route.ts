import { NextRequest, NextResponse } from "next/server";
import { getFilteredSlots } from "@/lib/dummy-data";

export async function GET(req: NextRequest) {
  const specialistId = req.nextUrl.searchParams.get("specialistId");
  const serviceId = req.nextUrl.searchParams.get("serviceId");
  const mode = req.nextUrl.searchParams.get("mode");
  const dateFrom = req.nextUrl.searchParams.get("dateFrom");
  const dateTo = req.nextUrl.searchParams.get("dateTo");

  return NextResponse.json(
    getFilteredSlots({ specialistId, serviceId, mode, dateFrom, dateTo }).slice(0, 240)
  );
}
