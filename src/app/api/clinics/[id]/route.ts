import { NextRequest, NextResponse } from "next/server";
import { dummyClinic } from "@/lib/dummy-data";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (id !== dummyClinic.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(dummyClinic);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({ ...dummyClinic, ...body, updatedAt: new Date().toISOString() });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({ success: true, id });
}
