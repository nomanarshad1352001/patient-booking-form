import { NextRequest, NextResponse } from "next/server";
import { getFilteredSpecialists } from "@/lib/dummy-data";

export async function GET(req: NextRequest) {
  const serviceId = req.nextUrl.searchParams.get("serviceId");
  return NextResponse.json(getFilteredSpecialists({ serviceId }));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json(
    {
      id: `spec-${Date.now()}`,
      avatarUrl: null,
      active: true,
      ...body,
    },
    { status: 201 }
  );
}
