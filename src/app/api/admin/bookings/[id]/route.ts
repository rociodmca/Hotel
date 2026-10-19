import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canTransition, isBookingStatus, statusLabels } from "@/lib/booking-status";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json().catch(() => ({}));
    const status = json?.status;

    if (!isBookingStatus(status)) {
      return NextResponse.json({ error: "Estado no válido" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({ where: { id: params.id } });
    if (!booking) {
      return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
    }

    if (!canTransition(booking.status, status)) {
      return NextResponse.json(
        {
          error: `No se puede pasar de "${statusLabels[booking.status]}" a "${statusLabels[status]}"`
        },
        { status: 409 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: { status }
    });

    return NextResponse.json({ booking: updated });
  } catch (error) {
    console.error("PATCH /api/admin/bookings/[id]", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
