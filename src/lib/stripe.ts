import type { Booking } from "@prisma/client";

export type PaymentIntentResult = {
  clientSecret: string | null;
  amount: number;
  currency: "eur";
};

export async function createPaymentIntent(booking: Booking): Promise<PaymentIntentResult> {
  const secret = process.env.STRIPE_SECRET_KEY;
  const amount = Math.round(Number(booking.totalPrice) * 100);

  if (!secret) {
    console.info(`[stripe:dry-run] payment intent for booking ${booking.id} (${amount} EUR cents)`);
    return { clientSecret: null, amount, currency: "eur" };
  }

  const params = new URLSearchParams({
    amount: String(amount),
    currency: "eur",
    "metadata[bookingId]": booking.id,
    "automatic_payment_methods[enabled]": "true"
  });

  const res = await fetch("https://api.stripe.com/v1/payment_intents", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  if (!res.ok) {
    throw new Error(`Stripe error ${res.status}: ${await res.text()}`);
  }

  const data = (await res.json()) as { client_secret: string };
  return { clientSecret: data.client_secret, amount, currency: "eur" };
}
