import Image from "next/image";
import { formatCurrency } from "@/lib/format";
import type { SerializedRoom } from "@/lib/types";

const typeLabels: Record<string, string> = {
  STANDARD: "Estándar",
  SUPERIOR: "Doble Superior",
  SUITE: "Suite",
  RURAL_HOUSE: "Casa Rural"
};

export function RoomCard({ room }: { room: SerializedRoom }) {
  const image = room.images[0];
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-brand-800/5 transition duration-300 hover:shadow-lift">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-100">
        {image ? (
          <Image
            src={image}
            alt={room.title}
            fill
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        ) : null}
        <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 backdrop-blur">
          {typeLabels[room.type] ?? room.type}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold text-brand-800">{room.title}</h3>
          <p className="shrink-0 text-right">
            <span className="font-display text-lg font-semibold text-clay-700">
              {formatCurrency(room.basePrice)}
            </span>
            <span className="block text-[11px] uppercase tracking-wide text-brand-500">/ noche</span>
          </p>
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-brand-600">{room.description}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {room.amenities.slice(0, 4).map((a) => (
            <li
              key={a}
              className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600 ring-1 ring-brand-100"
            >
              {a}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="inline-flex items-center gap-1.5 text-sm text-brand-600">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <circle cx="9" cy="8" r="3" />
              <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
              <path d="M16 4.5a3 3 0 0 1 0 7" strokeLinecap="round" />
              <path d="M18 14c2.2.6 3.8 2.5 3.8 5" strokeLinecap="round" />
            </svg>
            Hasta {room.capacity} huéspedes
          </span>
          <a
            href="#reservar"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-clay-700 transition hover:text-clay-600"
          >
            Reservar
            <svg viewBox="0 0 24 24" className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}
