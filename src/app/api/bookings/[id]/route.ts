import { NextRequest, NextResponse } from "next/server";
import { dummyBookings } from "@/lib/dummy-data";

const prototypeBookings = dummyBookings;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const booking = prototypeBookings.find((item) => item.id === id);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(booking);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const index = prototypeBookings.findIndex((item) => item.id === id);
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  prototypeBookings[index] = {
    ...prototypeBookings[index],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(prototypeBookings[index]);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = prototypeBookings.findIndex((item) => item.id === id);

  if (index !== -1) {
    prototypeBookings[index] = {
      ...prototypeBookings[index],
      status: "cancelled",
      updatedAt: new Date().toISOString(),
    };
  }

  return NextResponse.json({ success: true, id });
}
