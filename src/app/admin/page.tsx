import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LogoutButton } from "@/components/LogoutButton";
import { BookingActions } from "@/components/BookingActions";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  BOOKING_STATUSES,
  isBookingStatus,
  statusLabels,
  statusStyles,
  type BookingStatus
} from "@/lib/booking-status";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Panel de administración | Hotel El Tormo"
};

async function getData(status?: BookingStatus) {
  try {
    const [rooms, bookings] = await Promise.all([
      prisma.room.findMany({ orderBy: { title: "asc" } }),
      prisma.booking.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { room: true }
      })
    ]);
    return { rooms, bookings };
  } catch {
    return { rooms: [], bookings: [] };
  }
}

const housekeepingLabels: Record<string, string> = {
  CLEAN: "Limpia",
  OCCUPIED: "Ocupada",
  DIRTY: "Por limpiar",
  MAINTENANCE: "Mantenimiento"
};

const housekeepingDot: Record<string, string> = {
  CLEAN: "bg-brand-500",
  OCCUPIED: "bg-clay-500",
  DIRTY: "bg-clay-700",
  MAINTENANCE: "bg-brand-300"
};

export default async function AdminPage({
  searchParams
}: {
  searchParams?: { status?: string };
}) {
  const activeStatus = isBookingStatus(searchParams?.status) ? searchParams!.status : undefined;
  const { rooms, bookings } = await getData(activeStatus);
  const revenue = bookings
    .filter((b) => b.status === "CONFIRMED" || b.status === "CHECKED_IN")
    .reduce((acc, b) => acc + Number(b.totalPrice), 0);
  const pending = bookings.filter((b) => b.status === "PENDING").length;

  return (
    <>
      <Header />
      <main className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tightest text-brand-800">
                Panel de administración
              </h1>
              <p className="mt-1 text-sm text-brand-600">
                Ocupación, estado de habitaciones e ingresos del hotel.
              </p>
            </div>
            <p className="text-sm text-brand-500">
              {new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(new Date())}
            </p>
            <LogoutButton />
          </header>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Habitaciones" value={String(rooms.length)} />
            <Stat label="Reservas recientes" value={String(bookings.length)} />
            <Stat label="Pendientes de confirmar" value={String(pending)} highlight={pending > 0} />
            <Stat label="Ingresos confirmados" value={formatCurrency(revenue)} />
          </div>

          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold text-brand-800">Estado de habitaciones</h2>
            <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-soft ring-1 ring-brand-800/5">
              <table className="w-full text-sm">
                <thead className="border-b border-brand-100 text-left text-xs uppercase tracking-wide text-brand-500">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Habitación</th>
                    <th className="px-5 py-3.5 font-semibold">Capacidad</th>
                    <th className="px-5 py-3.5 text-right font-semibold">Precio base</th>
                    <th className="px-5 py-3.5 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.id} className="border-b border-brand-50 last:border-0 hover:bg-brand-50/50">
                      <td className="px-5 py-3.5 font-medium text-brand-800">{room.title}</td>
                      <td className="px-5 py-3.5 text-brand-600 tabular-nums">{room.capacity}</td>
                      <td className="px-5 py-3.5 text-right text-brand-700 tabular-nums">
                        {formatCurrency(room.basePrice)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-2 text-brand-700">
                          <span
                            className={`h-2 w-2 rounded-full ${housekeepingDot[room.housekeeping] ?? "bg-brand-300"}`}
                            aria-hidden="true"
                          />
                          {housekeepingLabels[room.housekeeping] ?? room.housekeeping}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {rooms.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-10 text-center text-brand-500">
                        Sin datos. Configura la base de datos y ejecuta{" "}
                        <code className="rounded bg-brand-50 px-1.5 py-0.5">npm run db:seed</code>.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold text-brand-800">Reservas</h2>

            <nav className="mt-4 flex flex-wrap gap-2" aria-label="Filtrar reservas por estado">
              <FilterTab href="/admin" active={!activeStatus} label="Todas" />
              {BOOKING_STATUSES.map((s) => (
                <FilterTab
                  key={s}
                  href={`/admin?status=${s}`}
                  active={activeStatus === s}
                  label={statusLabels[s]}
                />
              ))}
            </nav>

            <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-soft ring-1 ring-brand-800/5">
              <table className="w-full text-sm">
                <thead className="border-b border-brand-100 text-left text-xs uppercase tracking-wide text-brand-500">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Huésped</th>
                    <th className="px-5 py-3.5 font-semibold">Habitación</th>
                    <th className="px-5 py-3.5 font-semibold">Fechas</th>
                    <th className="px-5 py-3.5 text-right font-semibold">Total</th>
                    <th className="px-5 py-3.5 font-semibold">Estado</th>
                    <th className="px-5 py-3.5 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-brand-50 last:border-0 hover:bg-brand-50/50">
                      <td className="px-5 py-3.5">
                        <span className="font-medium text-brand-800">{b.guestName}</span>
                        <span className="block text-xs text-brand-500">{b.guestEmail}</span>
                      </td>
                      <td className="px-5 py-3.5 text-brand-600">{b.room.title}</td>
                      <td className="px-5 py-3.5 text-brand-600 tabular-nums">
                        {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-medium text-brand-700 tabular-nums">
                        {formatCurrency(b.totalPrice)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                            statusStyles[b.status] ?? "bg-brand-100 text-brand-700"
                          }`}
                        >
                          {statusLabels[b.status] ?? b.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <BookingActions id={b.id} status={b.status} />
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-brand-500">
                        {activeStatus
                          ? `No hay reservas en estado "${statusLabels[activeStatus]}".`
                          : "Todavía no hay reservas."}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-brand-800/5">
      <p className="text-sm text-brand-600">{label}</p>
      <p
        className={`mt-1.5 font-display text-2xl font-semibold tabular-nums ${
          highlight ? "text-clay-700" : "text-brand-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function FilterTab({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-brand-800 text-paper"
          : "bg-white text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50"
      }`}
    >
      {label}
    </Link>
  );
}
