import type { Booking, Room } from "@prisma/client";
import { formatCurrency, formatDate } from "@/lib/format";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: EmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "reservas@hoteleltormo.com";

  if (!apiKey) {
    console.info(`[email:dry-run] -> ${to} | ${subject}`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ from, to, subject, html })
  });

  if (!res.ok) {
    throw new Error(`Resend error ${res.status}: ${await res.text()}`);
  }
}

export async function sendBookingConfirmation(booking: Booking, room: Room): Promise<void> {
  const subject = `Confirmación de reserva — ${room.title}`;
  const html = `
    <h2>¡Gracias por tu reserva, ${booking.guestName}!</h2>
    <p>Tu solicitud ha sido recibida. Detalles:</p>
    <ul>
      <li><strong>Habitación:</strong> ${room.title}</li>
      <li><strong>Entrada:</strong> ${formatDate(booking.checkIn)}</li>
      <li><strong>Salida:</strong> ${formatDate(booking.checkOut)}</li>
      <li><strong>Huéspedes:</strong> ${booking.guests}</li>
      <li><strong>Total estimado:</strong> ${formatCurrency(booking.totalPrice.toString())}</li>
      <li><strong>Referencia:</strong> ${booking.id.slice(0, 8).toUpperCase()}</li>
    </ul>
    <p>Política de cancelación: cancelación gratuita hasta 48 h antes de la llegada.</p>
    <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/checkin?booking=${booking.id}">Completar check-in online</a></p>
  `;

  await sendEmail({ to: booking.guestEmail, subject, html });
}
