import { NextRequest, NextResponse } from "next/server";
import { dummyClinic } from "@/lib/dummy-data";

export async function GET() {
  return NextResponse.json([dummyClinic]);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({ id: `clinic-${Date.now()}`, ...body }, { status: 201 });
}
