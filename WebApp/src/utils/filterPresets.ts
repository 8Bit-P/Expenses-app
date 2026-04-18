import { format, startOfMonth, endOfMonth } from "date-fns";

export const PRESETS = [
  { key: "this_month", label: "This Month" },
  { key: "last_month", label: "Last Month" },
  { key: "last_3m", label: "3 Months" },
  { key: "ytd", label: "Year to Date" },
] as const;

export type PresetKey = (typeof PRESETS)[number]["key"];

/** Returns the startDate/endDate strings for a given quick-select preset. */
export function buildPreset(preset: PresetKey): { startDate: string; endDate: string } {
  const n = new Date();

  switch (preset) {
    case "this_month": {
      return {
        startDate: format(startOfMonth(n), "yyyy-MM-dd"),
        endDate: format(endOfMonth(n), "yyyy-MM-dd"),
      };
    }
    case "last_month": {
      const first = new Date(n.getFullYear(), n.getMonth() - 1, 1);
      return {
        startDate: format(first, "yyyy-MM-dd"),
        endDate: format(endOfMonth(first), "yyyy-MM-dd"),
      };
    }
    case "last_3m": {
      const first = new Date(n.getFullYear(), n.getMonth() - 2, 1);
      return {
        startDate: format(first, "yyyy-MM-dd"),
        endDate: format(endOfMonth(n), "yyyy-MM-dd"),
      };
    }
    case "ytd": {
      return {
        startDate: format(new Date(n.getFullYear(), 0, 1), "yyyy-MM-dd"),
        endDate: format(endOfMonth(n), "yyyy-MM-dd"),
      };
    }
  }
}
