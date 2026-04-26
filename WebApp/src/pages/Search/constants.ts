import type { DomainKey } from "./types";
import type { PresetKey } from "../../utils/filterPresets";

export const ALL_DOMAINS: DomainKey[] = ["Transactions", "Assets", "Subscriptions"];

export type TimeframeKey = PresetKey | "all" | "custom";

export const TIMEFRAME_OPTIONS: { key: TimeframeKey; label: string }[] = [
  { key: "this_month", label: "This Month" },
  { key: "last_month", label: "Last Month" },
  { key: "last_3m", label: "Last 3 Months" },
  { key: "ytd", label: "Year to Date" },
  { key: "all", label: "All Time" },
  { key: "custom", label: "Custom Period…" },
];

export const domainColor = (domain: DomainKey) => {
  switch (domain) {
    case "Transactions":
      return "text-red-400";
    case "Assets":
      return "text-emerald-400";
    case "Subscriptions":
      return "text-violet-400";
  }
};
