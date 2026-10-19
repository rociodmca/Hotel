"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { actionLabels, nextStatuses, type BookingStatus } from "@/lib/booking-status";

const buttonStyles: Record<BookingStatus, string> = {
  CONFIRMED: "bg-brand-700 text-paper hover:bg-brand-800",
  CHECKED_IN: "bg-clay-600 text-white hover:bg-clay-700",
  CHECKED_OUT: "bg-brand-100 text-brand-800 hover:bg-brand-200",
  CANCELLED: "text-clay-700 ring-1 ring-clay-300 hover:bg-clay-100",
  PENDING: "text-brand-700 ring-1 ring-brand-300 hover:bg-brand-50"
};

export function BookingActions({ id, status }: { id: string; status: BookingStatus }) {
  const router = useRouter();
  const [pending, setPending] = useState<BookingStatus | null>(null);
  const [error, setError] = useState("");

  const options = nextStatuses(status);
  if (options.length === 0) {
    return <span className="text-xs text-brand-400">—</span>;
  }

  async function update(next: BookingStatus) {
    setPending(next);
    setError("");
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "No se pudo actualizar");
        return;
      }
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => update(s)}
          disabled={pending !== null}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${buttonStyles[s]}`}
        >
          {pending === s ? "…" : actionLabels[s]}
        </button>
      ))}
      {error ? (
        <span role="alert" className="text-xs font-medium text-clay-700">
          {error}
        </span>
      ) : null}
    </div>
  );
}
