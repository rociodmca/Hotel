export type DayStatus = "full" | "few" | "available";

export type DayAvailability = {
  date: string;
  freeRooms: number;
  totalRooms: number;
  status: DayStatus;
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

/**
 * Umbrales del semáforo de disponibilidad:
 * - full (rojo): no queda ninguna habitación libre
 * - few (naranja): quedan pocas (<= FEW_RATIO del total)
 * - available (verde): quedan muchas por encima del umbral
 */
export const FEW_THRESHOLD = 0.34;

export function statusFor(freeRooms: number, totalRooms: number): DayStatus {
  if (totalRooms <= 0) return "available";
  if (freeRooms <= 0) return "full";
  if (freeRooms / totalRooms <= FEW_THRESHOLD) return "few";
  return "available";
}

type Interval = { checkIn: Date; checkOut: Date };

export function buildMonthAvailability(
  year: number,
  month: number,
  totalRooms: number,
  bookings: Interval[]
): DayAvailability[] {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const days: DayAvailability[] = [];

  for (let i = 0; i < daysInMonth; i += 1) {
    const day = addDays(first, i);
    const dayMs = day.getTime();
    const occupied = bookings.filter((b) => {
      const start = new Date(b.checkIn).getTime();
      const end = new Date(b.checkOut).getTime();
      return dayMs >= start && dayMs < end;
    }).length;
    const freeRooms = Math.max(0, totalRooms - occupied);
    days.push({
      date: toISODate(day),
      freeRooms,
      totalRooms,
      status: statusFor(freeRooms, totalRooms)
    });
  }

  return days;
}

export function daysInRange(checkIn: Date, checkOut: Date): number {
  return Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / MS_PER_DAY));
}
