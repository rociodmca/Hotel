const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function nightsBetween(checkIn: Date, checkOut: Date): number {
  return Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / MS_PER_DAY));
}

type Numeric = number | string | { toString(): string };

export function formatCurrency(value: Numeric): string {
  const amount = typeof value === "number" ? value : Number(value.toString());
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}
