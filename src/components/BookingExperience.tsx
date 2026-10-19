"use client";

import { useCallback, useState } from "react";
import { Calendar } from "@/components/Calendar";
import { BookingForm } from "@/components/BookingForm";
import { formatLongDate, rangeHint, selectDay } from "@/lib/booking-range";
import type { SerializedRoom } from "@/lib/types";

type Props = { rooms: SerializedRoom[] };

export function BookingExperience({ rooms }: Props) {
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [hint, setHint] = useState("Elige tu fecha de entrada en el calendario.");

  const handleDayClick = useCallback(
    (date: string) => {
      const action = selectDay({ checkIn, checkOut }, date);
      setCheckIn(action.checkIn);
      setCheckOut(action.kind === "extend" ? action.checkOut : null);
      setHint(rangeHint(action));
    },
    [checkIn, checkOut]
  );

  const selectedText =
    checkIn && checkOut
      ? `Del ${formatLongDate(checkIn)} al ${formatLongDate(checkOut)}`
      : checkIn
        ? `Entrada ${formatLongDate(checkIn)}`
        : null;

  return (
    <>
      <section id="disponibilidad" className="scroll-mt-20 bg-brand-100/60 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tightest text-brand-800 sm:text-4xl">
              Mira qué fechas quedan libres
            </h2>
            <p className="mt-3 leading-relaxed text-brand-600">
              Actualizamos la disponibilidad en tiempo real. Pulsa un día para fijar tu entrada y,
              después, otro para la salida: el formulario se rellenará solo.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-brand-700">
              <li className="flex items-center gap-3">
                <span className="h-3.5 w-3.5 rounded-full bg-brand-400 ring-1 ring-brand-500" aria-hidden="true" />
                Muchas habitaciones disponibles
              </li>
              <li className="flex items-center gap-3">
                <span className="h-3.5 w-3.5 rounded-full bg-clay-300 ring-1 ring-clay-400" aria-hidden="true" />
                Quedan pocas, date prisa
              </li>
              <li className="flex items-center gap-3">
                <span className="h-3.5 w-3.5 rounded-full bg-clay-600 ring-1 ring-clay-700" aria-hidden="true" />
                Hotel completo
              </li>
            </ul>
            <p role="status" className="mt-6 rounded-xl bg-white/70 px-4 py-3 text-sm font-medium text-brand-700 ring-1 ring-brand-200">
              {selectedText ?? hint}
            </p>
          </div>
          <Calendar checkIn={checkIn} checkOut={checkOut} onDayClick={handleDayClick} />
        </div>
      </section>

      <section id="reservar" className="scroll-mt-20 bg-brand-900 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="text-paper lg:sticky lg:top-24">
            <h2 className="font-display text-3xl font-semibold tracking-tightest sm:text-4xl">
              Tu estancia, en dos minutos
            </h2>
            <p className="mt-4 leading-relaxed text-brand-200">
              Sin intermediarios ni comisiones. Recibirás la confirmación por email y un mensaje
              de bienvenida por WhatsApp con todos los detalles.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-brand-100">
              {[
                "Confirmación inmediata por email",
                "Recordatorio de llegada por WhatsApp",
                "Cancelación gratuita hasta 48 h antes"
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-clay-500/90 text-white">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <BookingForm
            rooms={rooms}
            checkIn={checkIn ?? undefined}
            checkOut={checkOut ?? undefined}
            onCheckInChange={(v) => setCheckIn(v)}
            onCheckOutChange={(v) => setCheckOut(v)}
          />
        </div>
      </section>
    </>
  );
}
