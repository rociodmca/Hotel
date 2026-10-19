import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RoomCard } from "@/components/RoomCard";
import { BookingExperience } from "@/components/BookingExperience";
import { prisma } from "@/lib/prisma";
import type { SerializedRoom } from "@/lib/types";

export const dynamic = "force-dynamic";

const guides = [
  {
    title: "Ruta de las Caras",
    text: "Esculturas gigantes talladas en roca a orillas del embalse de Buendía.",
    image: "/images/guides/ruta-caras.svg"
  },
  {
    title: "Ciudad Encantada",
    text: "Formaciones kársticas únicas en el Parque Natural de la Serranía de Cuenca.",
    image: "/images/guides/ciudad-encantada.svg"
  },
  {
    title: "Nacimiento del Río Cuervo",
    text: "Cascadas y pasarelas entre hayedos en un entorno espectacular.",
    image: "/images/guides/nacimiento-cuervo.svg"
  }
];

const benefits = [
  { title: "Reserva directa", text: "Sin comisiones ni intermediarios. El precio que ves es el que pagas." },
  { title: "Desayuno de la sierra", text: "Producto local cada mañana, incluido en tu estancia." },
  { title: "A un mensaje de distancia", text: "Atención cercana por WhatsApp antes, durante y después." },
  { title: "Check-in sin colas", text: "Completa tus datos online y entra directo a tu habitación." }
];

async function getRooms(): Promise<SerializedRoom[]> {
  try {
    const rooms = await prisma.room.findMany({ orderBy: { basePrice: "asc" } });
    return rooms.map((room) => ({
      id: room.id,
      title: room.title,
      slug: room.slug,
      type: room.type,
      description: room.description,
      basePrice: Number(room.basePrice),
      capacity: room.capacity,
      amenities: room.amenities,
      images: room.images,
      housekeeping: room.housekeeping
    }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const rooms = await getRooms();
  const cheapest = rooms[0]?.basePrice ?? 85;
  const hotelName = process.env.NEXT_PUBLIC_HOTEL_NAME ?? "Hotel El Tormo";

  return (
    <>
      <Header />
      <main>
        {/* Hero: a thesis, not a header */}
        <section className="relative flex min-h-[88vh] items-end overflow-hidden">
          <Image
            src="/images/hero-serrania.svg"
            alt="La Serranía de Cuenca al atardecer"
            fill
            priority
            className="animate-ken-burns object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/40 to-brand-950/10" />

          <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-14 pt-28">
            <h1 className="max-w-3xl animate-fade-rise font-display text-[clamp(2.5rem,7vw,4.5rem)] font-semibold leading-[0.98] tracking-tightest text-paper">
              Dormir donde empieza la sierra.
            </h1>
            <p className="mt-5 max-w-xl animate-fade-rise text-lg leading-relaxed text-brand-100">
              {hotelName} es un alojamiento boutique y rural a las puertas del Parque Natural.
              Reserva sin comisiones, desayuno de la tierra y la sierra como única vecina.
            </p>

            <div className="mt-8 flex animate-fade-rise flex-wrap items-center gap-3">
              <a href="#reservar" className="btn-primary">
                Reservar ahora
              </a>
              <a href="#habitaciones" className="btn-ghost border-paper/40 text-paper hover:bg-paper/10 hover:border-paper">
                Ver habitaciones
              </a>
            </div>

            <p className="mt-10 animate-fade-rise border-t border-paper/20 pt-5 text-sm text-brand-100">
              Desde <span className="font-semibold text-paper">{cheapest} €/noche</span> · Desayuno
              incluido · Reserva directa sin comisiones · {Math.max(rooms.length, 4)} formas distintas
              de alojarte
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="border-b border-brand-800/10 bg-paper">
          <div className="mx-auto grid max-w-6xl gap-x-10 gap-y-8 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div key={b.title}>
                <h2 className="font-display text-base font-semibold text-brand-800">{b.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-brand-600">{b.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Rooms */}
        <section id="habitaciones" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tightest text-brand-800 sm:text-4xl">
              Elige tu rincón en la sierra
            </h2>
            <p className="mt-3 text-brand-600">
              De una acogedora habitación estándar a la casa rural completa para grupos. Todas con
              desayuno incluido y vistas al entorno.
            </p>
          </div>

          {rooms.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-2xl bg-white p-6 text-brand-600 ring-1 ring-brand-800/5">
              Configura la base de datos y ejecuta <code>npm run db:seed</code> para ver las
              habitaciones.
            </p>
          )}
        </section>

        {/* Availability + Booking (shared state) */}
        <BookingExperience rooms={rooms} />

        {/* Surroundings */}
        <section id="entorno" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tightest text-brand-800 sm:text-4xl">
              Qué ver en la Serranía
            </h2>
            <p className="mt-3 text-brand-600">
              Te contamos nuestros rincones favoritos, esos que no salen en las postales.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {guides.map((g) => (
              <article
                key={g.title}
                className="group overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-brand-800/5 transition duration-300 hover:shadow-lift"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={g.image}
                    alt={g.title}
                    fill
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width:640px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-brand-800">{g.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-600">{g.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Close */}
        <section className="bg-clay-600">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-14 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tightest text-white sm:text-3xl">
                La sierra te está esperando.
              </h2>
              <p className="mt-2 text-clay-100">Reserva hoy y olvídate del resto.</p>
            </div>
            <a
              href="#reservar"
              className="inline-flex items-center justify-center rounded-full bg-brand-900 px-7 py-3.5 font-semibold text-paper shadow-soft transition hover:bg-brand-800"
            >
              Reservar ahora
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
