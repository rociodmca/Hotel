"use client";

import { useState } from "react";

export function CheckInForm({ bookingId }: { bookingId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = new FormData(e.currentTarget);
    const payload = {
      bookingId,
      documentType: form.get("documentType"),
      documentNumber: form.get("documentNumber"),
      nationality: form.get("nationality"),
      birthDate: form.get("birthDate")
    };

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No hemos podido registrar tus datos.");
      setStatus("ok");
      setMessage("Datos registrados. Te esperamos en la sierra.");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Algo no ha ido bien. Inténtalo de nuevo.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-6 rounded-3xl bg-white p-6 shadow-lift ring-1 ring-brand-800/5 sm:p-8"
    >
      <label className="label">
        Referencia de reserva
        <input
          name="bookingId"
          defaultValue={bookingId}
          required
          placeholder="XXXXXXXX"
          autoComplete="off"
          spellCheck={false}
          className="field mt-1.5 font-mono uppercase tracking-widest"
        />
      </label>

      <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
        <label className="label">
          Tipo de documento
          <select name="documentType" className="field mt-1.5">
            <option value="DNI">DNI</option>
            <option value="NIE">NIE</option>
            <option value="PASSPORT">Pasaporte</option>
          </select>
        </label>

        <label className="label">
          Número de documento
          <input
            name="documentNumber"
            required
            autoComplete="off"
            spellCheck={false}
            className="field mt-1.5"
          />
        </label>

        <label className="label">
          Nacionalidad
          <input name="nationality" required autoComplete="country-name" className="field mt-1.5" />
        </label>

        <label className="label">
          Fecha de nacimiento
          <input type="date" name="birthDate" required className="field mt-1.5" />
        </label>
      </div>

      <button type="submit" disabled={status === "loading"} className="btn-primary justify-self-start">
        {status === "loading" ? (
          <>
            <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.3" />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Enviando…
          </>
        ) : (
          "Enviar datos"
        )}
      </button>

      {message ? (
        <p
          role="status"
          className={`rounded-xl px-4 py-3 text-sm ${
            status === "ok" ? "bg-brand-100 text-brand-800" : "bg-clay-100 text-clay-800"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
