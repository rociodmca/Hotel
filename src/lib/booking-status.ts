export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "CHECKED_IN"
  | "CHECKED_OUT";

export const BOOKING_STATUSES: BookingStatus[] = [
  "PENDING",
  "CONFIRMED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "CANCELLED"
];

export const statusLabels: Record<BookingStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  CHECKED_IN: "En casa",
  CHECKED_OUT: "Finalizada"
};

export const statusStyles: Record<BookingStatus, string> = {
  PENDING: "bg-clay-100 text-clay-800",
  CONFIRMED: "bg-brand-100 text-brand-800",
  CANCELLED: "bg-brand-50 text-brand-500",
  CHECKED_IN: "bg-brand-700 text-paper",
  CHECKED_OUT: "bg-brand-100 text-brand-600"
};

/**
 * Transiciones permitidas entre estados de reserva. Los estados terminales
 * (CHECKED_OUT, CANCELLED) no tienen salida.
 */
const TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["CHECKED_IN", "CANCELLED"],
  CHECKED_IN: ["CHECKED_OUT"],
  CHECKED_OUT: [],
  CANCELLED: []
};

export function isBookingStatus(value: unknown): value is BookingStatus {
  return typeof value === "string" && BOOKING_STATUSES.includes(value as BookingStatus);
}

export function canTransition(from: BookingStatus, to: BookingStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

export function nextStatuses(from: BookingStatus): BookingStatus[] {
  return TRANSITIONS[from];
}

/** Etiqueta del botón que lleva a cada estado. */
export const actionLabels: Record<BookingStatus, string> = {
  PENDING: "Reabrir",
  CONFIRMED: "Confirmar",
  CANCELLED: "Cancelar",
  CHECKED_IN: "Check-in",
  CHECKED_OUT: "Check-out"
};
