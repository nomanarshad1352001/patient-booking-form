import { NextRequest, NextResponse } from "next/server";
import { dummyServices } from "@/lib/dummy-data";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const service = dummyServices.find((item) => item.id === id);
  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(service);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const service = dummyServices.find((item) => item.id === id);
  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...service, ...body, updatedAt: new Date().toISOString() });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({ success: true, id });
}
