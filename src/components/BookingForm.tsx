"use client";

import { useMemo, useState } from "react";
import { formatCurrency } from "@/lib/format";
import type { SerializedRoom } from "@/lib/types";

type Props = {
  rooms: SerializedRoom[];
  checkIn?: string;
  checkOut?: string;
  onCheckInChange?: (value: string) => void;
  onCheckOutChange?: (value: string) => void;
};

function todayISO(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function nextDay(iso: string): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function BookingForm({
  rooms,
  checkIn: checkInProp,
  checkOut: checkOutProp,
  onCheckInChange,
  onCheckOutChange
}: Props) {
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? "");
  const [checkInState, setCheckInState] = useState(todayISO(0));
  const [checkOutState, setCheckOutState] = useState(todayISO(1));
  const [guests, setGuests] = useState(2);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  const checkIn = checkInProp ?? checkInState;
  const checkOut =
    checkOutProp ??
    (checkInProp ? nextDay(checkInProp) : checkOutState);

  function setCheckIn(value: string) {
    if (onCheckInChange) onCheckInChange(value);
    else setCheckInState(value);
  }

  function setCheckOut(value: string) {
    if (onCheckOutChange) onCheckOutChange(value);
    else setCheckOutState(value);
  }

  const selected = useMemo(() => rooms.find((r) => r.id === roomId), [rooms, roomId]);

  const nights = useMemo(() => {
    const a = new Date(checkIn).getTime();
    const b = new Date(checkOut).getTime();
    return Math.max(0, Math.round((b - a) / 86400000));
  }, [checkIn, checkOut]);

  const estimate = useMemo(() => {
    if (!selected || nights <= 0) return 0;
    return selected.basePrice * nights;
  }, [selected, nights]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = new FormData(e.currentTarget);

    const payload = {
      roomId,
      guestName: String(form.get("guestName") ?? ""),
      guestEmail: String(form.get("guestEmail") ?? ""),
      guestPhone: String(form.get("guestPhone") ?? ""),
      checkIn,
      checkOut,
      guests,
      notes: String(form.get("notes") ?? "") || undefined
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo crear la reserva");
      setStatus("ok");
      setMessage(`Reserva recibida. Tu referencia es ${data.booking.id.slice(0, 8).toUpperCase()}.`);
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Algo no ha ido bien. Inténtalo de nuevo.");
    }
  }

  if (rooms.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-soft ring-1 ring-brand-800/5">
        <p className="font-display text-lg font-semibold text-brand-800">Aún no hay habitaciones</p>
        <p className="mt-1 text-sm text-brand-600">
          Configura la base de datos y ejecuta <code>npm run db:seed</code> para empezar.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-6 rounded-3xl bg-white p-6 shadow-lift ring-1 ring-brand-800/5 sm:p-8"
    >
      <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
        <label className="label sm:col-span-2">
          Habitación
          <select value={roomId} onChange={(e) => setRoomId(e.target.value)} className="field mt-1.5">
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title} — {formatCurrency(r.basePrice)}/noche
              </option>
            ))}
          </select>
        </label>

        <label className="label">
          Entrada
          <input
            type="date"
            value={checkIn}
            min={todayISO()}
            onChange={(e) => setCheckIn(e.target.value)}
            className="field mt-1.5"
          />
        </label>

        <label className="label">
          Salida
          <input
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={(e) => setCheckOut(e.target.value)}
            className="field mt-1.5"
          />
        </label>

        <label className="label">
          Huéspedes
          <input
            type="number"
            min={1}
            max={selected?.capacity ?? 12}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="field mt-1.5"
          />
        </label>

        <label className="label">
          Teléfono
          <input name="guestPhone" type="tel" required autoComplete="tel" className="field mt-1.5" />
        </label>

        <label className="label">
          Nombre completo
          <input name="guestName" required minLength={2} autoComplete="name" className="field mt-1.5" />
        </label>

        <label className="label">
          Email
          <input name="guestEmail" type="email" required autoComplete="email" className="field mt-1.5" />
        </label>

        <label className="label sm:col-span-2">
          ¿Algo que debamos saber? <span className="font-normal text-brand-400">(opcional)</span>
          <textarea name="notes" rows={2} className="field mt-1.5" />
        </label>
      </div>

      <div className="flex flex-col gap-4 border-t border-brand-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-3xl font-semibold text-brand-800">
            {formatCurrency(estimate)}
          </span>
          <span className="text-sm text-brand-500">
            {nights > 0 ? `${nights} ${nights === 1 ? "noche" : "noches"} · impuestos no incluidos` : "Selecciona tus fechas"}
          </span>
        </div>
        <button
          type="submit"
          disabled={status === "loading" || nights <= 0}
          className="btn-primary w-full sm:w-auto"
        >
          {status === "loading" ? (
            <>
              <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.3" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              Enviando…
            </>
          ) : (
            "Solicitar reserva"
          )}
        </button>
      </div>

      {message ? (
        <p
          role="status"
          className={`rounded-xl px-4 py-3 text-sm ${
            status === "ok"
              ? "bg-brand-100 text-brand-800"
              : "bg-clay-100 text-clay-800"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
