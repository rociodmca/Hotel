export type RangeState = {
  checkIn: string | null;
  checkOut: string | null;
};

export type RangeAction =
  | { kind: "start"; checkIn: string }
  | { kind: "extend"; checkIn: string; checkOut: string };

/**
 * Decide el siguiente estado del rango a partir del día pulsado en el calendario.
 * - Sin entrada, o rango ya cerrado: el clic inicia un rango nuevo.
 * - Clic anterior o igual a la entrada: reinicia la entrada.
 * - Clic posterior: cierra el rango con esa salida.
 */
export function selectDay(state: RangeState, date: string): RangeAction {
  const { checkIn, checkOut } = state;
  if (!checkIn || checkOut) {
    return { kind: "start", checkIn: date };
  }
  if (date <= checkIn) {
    return { kind: "start", checkIn: date };
  }
  return { kind: "extend", checkIn, checkOut: date };
}

export function formatLongDate(date: string): string {
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long" }).format(new Date(date));
}

export function rangeHint(action: RangeAction): string {
  if (action.kind === "start") {
    return `Entrada ${formatLongDate(action.checkIn)}. Elige ahora la fecha de salida.`;
  }
  return `Del ${formatLongDate(action.checkIn)} al ${formatLongDate(action.checkOut)}. ¡Listo para reservar!`;
}
