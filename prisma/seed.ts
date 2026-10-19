import { PrismaClient, RoomType } from "@prisma/client";

const prisma = new PrismaClient();

const rooms = [
  {
    title: "Habitación Estándar",
    slug: "habitacion-estandar",
    type: RoomType.STANDARD,
    description:
      "Acogedora habitación con vistas a la Serranía de Cuenca. Ideal para escapadas en pareja.",
    basePrice: 85,
    capacity: 2,
    amenities: ["Wi-Fi", "Aire acondicionado", "TV", "Baño privado", "Desayuno incluido"],
    images: ["/images/rooms/estandar.svg"]
  },
  {
    title: "Doble Superior",
    slug: "doble-superior",
    type: RoomType.SUPERIOR,
    description:
      "Amplia habitación superior con balcón privado y zona de estar, perfecta para familias.",
    basePrice: 120,
    capacity: 3,
    amenities: ["Wi-Fi", "Aire acondicionado", "TV", "Balcón", "Minibar", "Desayuno incluido"],
    images: ["/images/rooms/doble-superior.svg"]
  },
  {
    title: "Suite Serranía",
    slug: "suite-serrania",
    type: RoomType.SUITE,
    description:
      "Suite de lujo con jacuzzi, chimenea y vistas panorámicas. La experiencia definitiva.",
    basePrice: 185,
    capacity: 2,
    amenities: ["Wi-Fi", "Jacuzzi", "Chimenea", "TV", "Minibar", "Vistas panorámicas"],
    images: ["/images/rooms/suite-serrania.svg"]
  },
  {
    title: "Casa Rural Completa",
    slug: "casa-rural-completa",
    type: RoomType.RURAL_HOUSE,
    description:
      "Casa rural completa con 4 habitaciones, cocina equipada y jardín privado. Ideal para grupos.",
    basePrice: 340,
    capacity: 8,
    amenities: ["Wi-Fi", "Cocina equipada", "Jardín", "Barbacoa", "Chimenea", "Parking"],
    images: ["/images/rooms/casa-rural.svg"]
  }
];

// Reservas de prueba: días con distinto nivel de ocupación.
// offsetStart/offsetEnd son días relativos a hoy.
// ALL_ROOMS = ocupa todas las habitaciones (semáforo rojo),
// otherwise = reserva de una habitación.
type TestBooking = {
  roomSlug: string;
  offsetStart: number;
  offsetEnd: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guests: number;
};

const ALL_ROOMS = "__ALL__";

const testBookings: TestBooking[] = [
  // Fin de semana completo (todas las habitaciones) -> rojo
  { roomSlug: ALL_ROOMS, offsetStart: 4, offsetEnd: 6, guestName: "Grupo Puente", guestEmail: "puente@example.com", guestPhone: "34600100004", guests: 2 },
  { roomSlug: ALL_ROOMS, offsetStart: 18, offsetEnd: 20, guestName: "Boda Serranía", guestEmail: "boda@example.com", guestPhone: "34600100018", guests: 2 },
  // Ocupación alta -> naranja (quedan pocas)
  { roomSlug: "habitacion-estandar", offsetStart: 10, offsetEnd: 13, guestName: "Ana Ruiz", guestEmail: "ana@example.com", guestPhone: "34600100010", guests: 2 },
  { roomSlug: "doble-superior", offsetStart: 10, offsetEnd: 13, guestName: "Luis Gómez", guestEmail: "luis@example.com", guestPhone: "34600100011", guests: 3 },
  { roomSlug: "suite-serrania", offsetStart: 10, offsetEnd: 13, guestName: "Marta Sanz", guestEmail: "marta@example.com", guestPhone: "34600100012", guests: 2 },
  // Ocupación media (verde pero con movimiento)
  { roomSlug: "habitacion-estandar", offsetStart: 25, offsetEnd: 28, guestName: "Carlos Peña", guestEmail: "carlos@example.com", guestPhone: "34600100025", guests: 2 },
  { roomSlug: "doble-superior", offsetStart: 25, offsetEnd: 27, guestName: "Nuria Vega", guestEmail: "nuria@example.com", guestPhone: "34600100026", guests: 2 },
  // Estancia larga en casa rural
  { roomSlug: "casa-rural-completa", offsetStart: 2, offsetEnd: 9, guestName: "Familia Ortega", guestEmail: "ortega@example.com", guestPhone: "34600100002", guests: 8 }
];

function dateFromOffset(days: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

async function main() {
  const roomBySlug = new Map<string, { id: string; basePrice: number }>();

  for (const room of rooms) {
    const saved = await prisma.room.upsert({
      where: { slug: room.slug },
      update: room,
      create: room
    });
    roomBySlug.set(room.slug, { id: saved.id, basePrice: Number(saved.basePrice) });
  }
  console.log(`Seeded ${rooms.length} rooms.`);

  // Limpia reservas de prueba previas (todas con email de ejemplo)
  await prisma.booking.deleteMany({
    where: { guestEmail: { endsWith: "@example.com" } }
  });

  const allRooms = rooms.map((r) => roomBySlug.get(r.slug)!);
  let created = 0;

  for (const b of testBookings) {
    const targets = b.roomSlug === ALL_ROOMS ? allRooms : [roomBySlug.get(b.roomSlug)!];
    const checkIn = dateFromOffset(b.offsetStart);
    const checkOut = dateFromOffset(b.offsetEnd);
    const nights = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000));

    for (const target of targets) {
      if (!target) continue;
      await prisma.booking.create({
        data: {
          roomId: target.id,
          guestName: b.guestName,
          guestEmail: b.guestEmail,
          guestPhone: b.guestPhone,
          checkIn,
          checkOut,
          guests: b.guests,
          totalPrice: target.basePrice * nights,
          status: "CONFIRMED"
        }
      });
      created += 1;
    }
  }

  console.log(`Seeded ${created} test bookings.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
