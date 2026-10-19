"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { DayAvailability } from "@/lib/availability";

type Props = {
  checkIn: string | null;
  checkOut: string | null;
  onDayClick: (date: string) => void;
  initialYear?: number;
  initialMonth?: number;
};

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];

const MONTH_NAMES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

const cellFor: Record<string, string> = {
  full: "bg-clay-600 text-white",
  few: "bg-clay-300 text-clay-900",
  available: "bg-brand-400 text-brand-950"
};

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function Calendar({ checkIn, checkOut, onDayClick, initialYear, initialMonth }: Props) {
  const today = new Date();
  const [year, setYear] = useState(initialYear ?? today.getFullYear());
  const [month, setMonth] = useState(initialMonth ?? today.getMonth() + 1);
  const [days, setDays] = useState<DayAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/availability?year=${year}&month=${month}`);
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setDays(data.days ?? []);
    } catch {
      setError(true);
      setDays([]);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    load();
  }, [load]);

  const firstWeekday = useMemo(() => {
    const dow = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
    return (dow + 6) % 7; // lunes = 0
  }, [year, month]);

  const todayISO = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  function shift(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 1) {
      m = 12;
      y -= 1;
    } else if (m > 12) {
      m = 1;
      y += 1;
    }
    setMonth(m);
    setYear(y);
  }

  function inRange(date: string): boolean {
    if (!checkIn) return false;
    const end = checkOut ?? checkIn;
    return date >= checkIn && date <= end;
  }

  return (
    <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-brand-800/5 sm:p-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => shift(-1)}
          aria-label="Mes anterior"
          className="flex h-9 w-9 items-center justify-center rounded-full text-brand-700 transition hover:bg-brand-50"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <p className="font-display text-lg font-semibold capitalize text-brand-800">
          {MONTH_NAMES[month - 1]} {year}
        </p>
        <button
          type="button"
          onClick={() => shift(1)}
          aria-label="Mes siguiente"
          className="flex h-9 w-9 items-center justify-center rounded-full text-brand-700 transition hover:bg-brand-50"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} className="pb-2 text-xs font-semibold uppercase text-brand-400">
            {d}
          </span>
        ))}

        {Array.from({ length: firstWeekday }).map((_, i) => (
          <span key={`pad-${i}`} aria-hidden="true" />
        ))}

        {loading
          ? Array.from({ length: 30 }).map((_, i) => (
              <span
                key={`sk-${i}`}
                className="aspect-square animate-shimmer rounded-lg bg-gradient-to-r from-brand-50 via-brand-100 to-brand-50 bg-[length:200%_100%]"
              />
            ))
          : days.map((day) => {
              const past = day.date < todayISO;
              const isEdge = day.date === checkIn || day.date === checkOut;
              const inSel = inRange(day.date) && !isEdge;
              const isToday = day.date === todayISO;
              const full = day.status === "full";
              const disabled = past || full;
              const dayNumber = Number(day.date.slice(8));

              return (
                <button
                  key={day.date}
                  type="button"
                  disabled={disabled}
                  onClick={() => onDayClick(day.date)}
                  title={
                    past
                      ? "Fecha pasada"
                      : full
                        ? "Hotel completo"
                        : `${day.freeRooms} de ${day.totalRooms} habitaciones libres`
                  }
                  aria-label={`${dayNumber} de ${MONTH_NAMES[month - 1]}: ${day.freeRooms} de ${day.totalRooms} habitaciones libres`}
                  aria-pressed={isEdge}
                  className={[
                    "relative flex aspect-square items-center justify-center rounded-lg text-sm font-semibold transition",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-600 focus-visible:ring-offset-2",
                    past
                      ? "cursor-not-allowed text-brand-200"
                      : full
                        ? "cursor-not-allowed bg-clay-600 text-white"
                        : `${cellFor[day.status]} hover:scale-[1.06] hover:shadow-soft`,
                    inSel ? "ring-2 ring-offset-1 ring-brand-700" : "",
                    isEdge ? "ring-2 ring-offset-2 ring-clay-700" : ""
                  ].join(" ")}
                >
                  {dayNumber}
                  {isToday ? (
                    <span className="absolute bottom-1 h-1 w-1 rounded-full bg-current" aria-hidden="true" />
                  ) : null}
                </button>
              );
            })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-brand-100 pt-4 text-xs text-brand-600">
        <Legend className="bg-brand-400" label="Disponible" />
        <Legend className="bg-clay-300" label="Últimas habitaciones" />
        <Legend className="bg-clay-600" label="Completo" />
      </div>

      {error ? (
        <p role="status" className="mt-3 text-xs text-clay-700">
          No hemos podido cargar la disponibilidad. Inténtalo de nuevo en unos segundos.
        </p>
      ) : null}
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${className}`} aria-hidden="true" />
      {label}
    </span>
  );
}
