import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkInSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = checkInSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos no válidos", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: parsed.data.bookingId }
    });
    if (!booking) {
      return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      bookingId: booking.id,
      checkedInData: {
        documentType: parsed.data.documentType,
        documentNumber: parsed.data.documentNumber,
        nationality: parsed.data.nationality,
        birthDate: parsed.data.birthDate
      },
      note: "Datos registrados (pendiente de persistencia SES.HOSPEDAJES)."
    });
  } catch (error) {
    console.error("POST /api/checkin", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
