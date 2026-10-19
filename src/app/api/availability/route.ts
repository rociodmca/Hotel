import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildMonthAvailability } from "@/lib/availability";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const now = new Date();
    const year = Number(searchParams.get("year")) || now.getUTCFullYear();
    const month = Number(searchParams.get("month")) || now.getUTCMonth() + 1;

    if (month < 1 || month > 12) {
      return NextResponse.json({ error: "Mes no válido" }, { status: 400 });
    }

    const monthStart = new Date(Date.UTC(year, month - 1, 1));
    const monthEnd = new Date(Date.UTC(year, month, 1));

    const [totalRooms, bookings] = await Promise.all([
      prisma.room.count(),
      prisma.booking.findMany({
        where: {
          status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
          checkIn: { lt: monthEnd },
          checkOut: { gt: monthStart }
        },
        select: { roomId: true, checkIn: true, checkOut: true }
      })
    ]);

    const days = buildMonthAvailability(year, month, totalRooms, bookings);

    return NextResponse.json({ year, month, totalRooms, days });
  } catch (error) {
    console.error("GET /api/availability", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
