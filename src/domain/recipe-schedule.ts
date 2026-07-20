import type { AdvanceStep } from '@/domain/recipe';

/**
 * Czysta logika czasu dla kroków wykonywanych z wyprzedzeniem. Nie zależy od
 * `zod` ani od modelu poza typem `AdvanceStep`, dzięki czemu może zasilać zarówno
 * prerendering strony, jak i lekki skrypt kliencki bez wciągania walidacji do
 * bundla. Godziny liczymy w minutach od północy (`0..1439`).
 */

const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;

/** „30 min”, „2 godz”, „1 godz 30 min” — z surowych minut wyprzedzenia. */
export function formatLeadTime(minutes: number): string {
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const remainder = minutes % MINUTES_PER_HOUR;
  if (hours === 0) return `${remainder} min`;
  if (remainder === 0) return `${hours} godz`;
  return `${hours} godz ${remainder} min`;
}

/** Minuty od północy (`0..1439`) na zegar 24-godzinny „HH:MM”. */
export function formatClock(minutesFromMidnight: number): string {
  const normalized = ((minutesFromMidnight % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hours = Math.floor(normalized / MINUTES_PER_HOUR);
  const minutes = normalized % MINUTES_PER_HOUR;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Parsuje wartość pola `<input type="time">` („HH:MM”) na minuty od północy.
 * Zwraca `null` dla pustej lub niepoprawnej wartości, żeby wywołujący mógł
 * bezpiecznie pominąć wyliczenie.
 */
export function parseClock(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * MINUTES_PER_HOUR + minutes;
}

export interface ScheduledAdvanceStep extends AdvanceStep {
  /** Godzina startu jako minuty od północy (`0..1439`). */
  startMinutes: number;
  /** Przesunięcie doby względem dnia podania: `0` — ten sam dzień, `-1` — dzień wcześniej. */
  dayOffset: number;
}

/**
 * Dla zadanej godziny podania (minuty od północy) liczy, o której zacząć każdy
 * krok. Start przed północą zawija się na dzień wcześniejszy i jest to sygnalizowane
 * przez `dayOffset`, więc namaczanie „na noc” trafia poprawnie na poprzedni wieczór.
 */
export function scheduleAdvanceSteps(
  steps: readonly AdvanceStep[],
  serveMinutes: number,
): ScheduledAdvanceStep[] {
  return steps.map((step) => {
    const raw = serveMinutes - step.leadTimeMinutes;
    const dayOffset = Math.floor(raw / MINUTES_PER_DAY);
    const startMinutes = ((raw % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
    return { ...step, startMinutes, dayOffset };
  });
}
