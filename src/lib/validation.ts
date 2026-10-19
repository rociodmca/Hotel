import { z } from "zod";

export const bookingSchema = z
  .object({
    roomId: z.string().uuid(),
    guestName: z.string().min(2, "Nombre demasiado corto").max(120),
    guestEmail: z.string().email("Email no válido"),
    guestPhone: z.string().min(6, "Teléfono no válido").max(30),
    checkIn: z.coerce.date(),
    checkOut: z.coerce.date(),
    guests: z.coerce.number().int().min(1).max(12).default(1),
    notes: z.string().max(500).optional()
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "La fecha de salida debe ser posterior a la de entrada",
    path: ["checkOut"]
  });

export type BookingInput = z.infer<typeof bookingSchema>;

export const checkInSchema = z.object({
  bookingId: z.string().uuid(),
  documentType: z.enum(["DNI", "PASSPORT", "NIE"]),
  documentNumber: z.string().min(4).max(30),
  nationality: z.string().min(2).max(60),
  birthDate: z.coerce.date()
});

export type CheckInInput = z.infer<typeof checkInSchema>;
