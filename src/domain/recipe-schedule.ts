/**
 * Czysta logika czasu dla kroków wykonywanych z wyprzedzeniem. Nie zależy od
 * `zod` ani od modelu, dzięki czemu może zasilać zarówno prerendering strony,
 * jak i lekki skrypt kliencki bez wciągania walidacji do bundla.
 */

const MINUTES_PER_HOUR = 60;

/** „30 min”, „2 godz”, „1 godz 30 min” — z surowych minut wyprzedzenia. */
export function formatLeadTime(minutes: number): string {
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const remainder = minutes % MINUTES_PER_HOUR;
  if (hours === 0) return `${remainder} min`;
  if (remainder === 0) return `${hours} godz`;
  return `${hours} godz ${remainder} min`;
}
