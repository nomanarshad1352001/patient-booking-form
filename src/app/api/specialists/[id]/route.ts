import { NextRequest, NextResponse } from "next/server";
import { dummySpecialists } from "@/lib/dummy-data";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const specialist = dummySpecialists.find((item) => item.id === id);
  if (!specialist) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(specialist);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const specialist = dummySpecialists.find((item) => item.id === id);
  if (!specialist) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...specialist, ...body, updatedAt: new Date().toISOString() });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({ success: true, id });
}
