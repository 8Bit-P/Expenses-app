import { format, isToday, isYesterday } from "date-fns";
import { enUS, es } from "date-fns/locale";
import i18next from "i18next";

/** Helper to get current date-fns locale */
function getLocale() {
  const lang = i18next.language || "en";
  return lang.startsWith("es") ? es : enUS;
}

/**
 * Produces a human-readable label for a date range.
 */
export function formatDateLabel(start?: string, end?: string): string {
  if (!start && !end) return i18next.t("common.allTime");

  /** Parse a yyyy-MM-dd string safely without timezone shifting. */
  const parseLocal = (d: string): Date => {
    const [y, m, day] = d.split("-").map(Number);
    return new Date(y, m - 1, day);
  };

  const locale = getLocale();
  const fmt = (d: string) => format(parseLocal(d), "MMM d, yyyy", { locale });

  if (start && end) {
    const [sy, sm, sd] = start.split("-").map(Number);
    const [ey, em, ed] = end.split("-").map(Number);
    const lastDayOfEndMonth = new Date(ey, em, 0).getDate();

    // Full calendar month — collapse to e.g. "April 2026"
    if (sy === ey && sm === em && sd === 1 && ed === lastDayOfEndMonth) {
      return format(new Date(sy, sm - 1, 1), "MMMM yyyy", { locale });
    }

    // Same year — shorten the start to just month
    if (sy === ey) {
      return `${format(new Date(sy, sm - 1, 1), "MMM d", { locale })} – ${fmt(end)}`;
    }

    return `${fmt(start)} – ${fmt(end)}`;
  }

  if (start) return i18next.t("common.from", { date: fmt(start) });
  return i18next.t("common.until", { date: fmt(end!) });
}

/**
 * Formats a "yyyy-MM-dd" transaction date into a short label like "Apr 18".
 */
export function formatTransactionDate(dateString: string): string {
  try {
    const [y, m, d] = dateString.split("-").map(Number);
    return format(new Date(y, m - 1, d), "MMM d", { locale: getLocale() });
  } catch {
    return dateString;
  }
}

/**
 * Formats a "yyyy-MM-dd" date into "Today", "Yesterday", or "Month d".
 */
export function formatRelativeDate(dateString: string): string {
  try {
    const [y, m, d] = dateString.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    if (isToday(date)) return i18next.t("common.today");
    if (isYesterday(date)) return i18next.t("common.yesterday");
    return format(date, "MMMM d", { locale: getLocale() });
  } catch {
    return dateString;
  }
}
