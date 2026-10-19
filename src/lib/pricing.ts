export type Season = {
  name: string;
  start: string;
  end: string;
  multiplier: number;
};

export const SEASONS: Season[] = [
  { name: "Alta (verano y festivos)", start: "06-15", end: "09-15", multiplier: 1.35 },
  { name: "Media (fines de semana)", start: "01-01", end: "12-31", multiplier: 1.15 }
];

export function seasonMultiplier(date: Date): number {
  const md = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const season = SEASONS.find((s) => md >= s.start && md <= s.end);
  return season?.multiplier ?? 1;
}

export function applySeason(basePrice: number, checkIn: Date, checkOut: Date, nights: number): number {
  let total = 0;
  const cursor = new Date(checkIn);
  for (let i = 0; i < nights; i += 1) {
    total += basePrice * seasonMultiplier(cursor);
    cursor.setDate(cursor.getDate() + 1);
  }
  return Math.round(total * 100) / 100;
}
