import { NextRequest, NextResponse } from "next/server";
import { dummyServices, getFilteredServices } from "@/lib/dummy-data";

export async function GET(req: NextRequest) {
  const specialistId = req.nextUrl.searchParams.get("specialistId");
  const mode = req.nextUrl.searchParams.get("mode");
  return NextResponse.json(getFilteredServices({ specialistId, mode }));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json(
    {
      id: `svc-${Date.now()}`,
      currency: "PLN",
      onlineAvailable: true,
      inOfficeAvailable: true,
      active: true,
      ...body,
    },
    { status: 201 }
  );
}

export { dummyServices };
