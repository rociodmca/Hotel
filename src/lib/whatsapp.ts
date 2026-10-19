import type { Booking } from "@prisma/client";
import { formatCurrency, formatDate } from "@/lib/format";

export async function sendWhatsAppMessage(to: string, body: string): Promise<void> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!sid || !token || !from) {
    console.info(`[whatsapp:dry-run] -> ${to} | ${body}`);
    return;
  }

  const params = new URLSearchParams({
    From: from,
    To: to.startsWith("whatsapp:") ? to : `whatsapp:${to}`,
    Body: body
  });

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  if (!res.ok) {
    throw new Error(`Twilio error ${res.status}: ${await res.text()}`);
  }
}

export async function notifyBookingByWhatsApp(booking: Booking): Promise<void> {
  const body =
    `Hola ${booking.guestName}, hemos recibido tu reserva en Hotel El Tormo ` +
    `(${formatDate(booking.checkIn)} → ${formatDate(booking.checkOut)}, ` +
    `${formatCurrency(booking.totalPrice.toString())}). ` +
    `Referencia ${booking.id.slice(0, 8).toUpperCase()}.`;

  await sendWhatsAppMessage(booking.guestPhone, body);
}
