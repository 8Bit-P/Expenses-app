import { format } from 'date-fns';

/**
 * Produces a human-readable label for a date range.
 *
 * Examples:
 *   "April 2026"          — a full calendar month
 *   "Jan – Mar 31, 2026"  — partial multi-month within same year
 *   "From Jan 1, 2026"    — open-ended start
 *   "All Time"            — no dates set
 */
export function formatDateLabel(start?: string, end?: string): string {
  if (!start && !end) return 'All Time';

  /** Parse a yyyy-MM-dd string safely without timezone shifting. */
  const parseLocal = (d: string): Date => {
    const [y, m, day] = d.split('-').map(Number);
    return new Date(y, m - 1, day);
  };

  const fmt = (d: string) => format(parseLocal(d), 'MMM d, yyyy');

  if (start && end) {
    const [sy, sm, sd] = start.split('-').map(Number);
    const [ey, em, ed] = end.split('-').map(Number);
    const lastDayOfEndMonth = new Date(ey, em, 0).getDate();

    // Full calendar month — collapse to e.g. "April 2026"
    if (sy === ey && sm === em && sd === 1 && ed === lastDayOfEndMonth) {
      return format(new Date(sy, sm - 1, 1), 'MMMM yyyy');
    }

    // Same year — shorten the start to just month
    if (sy === ey) {
      return `${format(new Date(sy, sm - 1, 1), 'MMM d')} – ${fmt(end)}`;
    }

    return `${fmt(start)} – ${fmt(end)}`;
  }

  if (start) return `From ${fmt(start)}`;
  return `Until ${fmt(end!)}`;
}
