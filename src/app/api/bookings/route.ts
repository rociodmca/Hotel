import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validation";
import { nightsBetween } from "@/lib/format";
import { applySeason } from "@/lib/pricing";
import { sendBookingConfirmation } from "@/lib/email";
import { notifyBookingByWhatsApp } from "@/lib/whatsapp";

export async function GET() {
  const rooms = await prisma.room.findMany({ orderBy: { basePrice: "asc" } });
  return NextResponse.json({ rooms });
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bookingSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos no válidos", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const room = await prisma.room.findUnique({ where: { id: data.roomId } });
    if (!room) {
      return NextResponse.json({ error: "Habitación no encontrada" }, { status: 404 });
    }

    if (data.guests > room.capacity) {
      return NextResponse.json(
        { error: `La habitación admite un máximo de ${room.capacity} huéspedes` },
        { status: 400 }
      );
    }

    const overlap = await prisma.booking.findFirst({
      where: {
        roomId: data.roomId,
        status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
        checkIn: { lt: data.checkOut },
        checkOut: { gt: data.checkIn }
      }
    });
    if (overlap) {
      return NextResponse.json(
        { error: "La habitación no está disponible en esas fechas" },
        { status: 409 }
      );
    }

    const nights = nightsBetween(data.checkIn, data.checkOut);
    const total = applySeason(Number(room.basePrice), data.checkIn, data.checkOut, nights);

    const booking = await prisma.booking.create({
      data: {
        roomId: data.roomId,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guests: data.guests,
        notes: data.notes,
        totalPrice: total,
        status: "PENDING"
      }
    });

    await Promise.allSettled([
      sendBookingConfirmation(booking, room),
      notifyBookingByWhatsApp(booking)
    ]);

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookings", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
