export function Header() {
  const hotelName = process.env.NEXT_PUBLIC_HOTEL_NAME ?? "Hotel El Tormo";
  return (
    <header className="sticky top-0 z-40 border-b border-brand-800/10 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <a
          href="/"
          className="group flex items-center gap-2.5 text-brand-800"
          aria-label={`${hotelName}, inicio`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-paper transition group-hover:bg-brand-600">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M3 20 L9 8 L13 15 L16 10 L21 20 Z" strokeLinejoin="round" strokeLinecap="round" />
              <circle cx="17.5" cy="6" r="2.2" />
            </svg>
          </span>
          <span className="font-display text-lg font-semibold tracking-tightest">{hotelName}</span>
        </a>

        <nav className="flex items-center gap-1.5 text-sm font-medium text-brand-700">
          <a href="/#habitaciones" className="hidden rounded-full px-3.5 py-2 transition hover:bg-brand-100 sm:inline-block">
            Habitaciones
          </a>
          <a href="/#disponibilidad" className="hidden rounded-full px-3.5 py-2 transition hover:bg-brand-100 md:inline-block">
            Disponibilidad
          </a>
          <a href="/#entorno" className="hidden rounded-full px-3.5 py-2 transition hover:bg-brand-100 md:inline-block">
            Entorno
          </a>
          <a href="/checkin" className="hidden rounded-full px-3.5 py-2 transition hover:bg-brand-100 sm:inline-block">
            Check-in
          </a>
          <a href="/#reservar" className="rounded-full bg-clay-600 px-5 py-2 text-white shadow-soft transition hover:bg-clay-500">
            Reservar
          </a>
        </nav>
      </div>
    </header>
  );
}
