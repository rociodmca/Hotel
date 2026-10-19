export function Footer() {
  const hotelName = process.env.NEXT_PUBLIC_HOTEL_NAME ?? "Hotel El Tormo";
  const phone = process.env.NEXT_PUBLIC_HOTEL_WHATSAPP ?? "";
  return (
    <footer className="border-t border-brand-800/10 bg-brand-900 text-brand-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <p className="font-display text-2xl font-semibold tracking-tightest text-paper">{hotelName}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-brand-200">
            Alojamiento boutique y rural en la Serranía de Cuenca. Reserva directa, sin
            intermediarios, con la sierra como única vecina.
          </p>
        </div>

        <nav aria-label="Enlaces">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">Reserva</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="/#habitaciones" className="transition hover:text-paper">Habitaciones</a></li>
            <li><a href="/#reservar" className="transition hover:text-paper">Reservar</a></li>
            <li><a href="/checkin" className="transition hover:text-paper">Check-in online</a></li>
            <li><a href="/admin" className="transition hover:text-paper">Acceso personal</a></li>
          </ul>
        </nav>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">Contacto</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Serranía de Cuenca, España</li>
            <li>
              <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className="transition hover:text-paper">
                WhatsApp directo
              </a>
            </li>
            <li>
              <a href="mailto:reservas@hoteleltormo.com" className="transition hover:text-paper">
                reservas@hoteleltormo.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-800/40">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-brand-400">
          © {new Date().getFullYear()} {hotelName}. Reserva directa sin comisiones.
        </p>
      </div>
    </footer>
  );
}
