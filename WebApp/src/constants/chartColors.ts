export const CATEGORY_COLORS = [
  "#2f5bd8", // cobalt
  "#e07a2e", // orange
  "#14a37f", // teal
  "#d14d72", // raspberry
  "#c9a227", // mustard
  "#4fa3d9", // sky
  "#7fa63a", // olive
  "#8c6a4f", // umber
  "#7a6fd0", // iris
  "#a19f95", // stone
];

/** Theme-aware chart tokens (resolved by the browser from CSS variables). */
export const CHART = {
  primary: "var(--chart-1)",
  secondary: "var(--chart-2)",
  income: "var(--secondary)",
  expense: "var(--error)",
  grid: "var(--chart-grid)",
  axis: "var(--chart-axis)",
  cursor: "var(--chart-cursor)",
  surface: "var(--surface-container-lowest)",
} as const;

/** Shared Recharts axis tick style. */
export const AXIS_TICK = { fill: "var(--chart-axis)", fontSize: 11, fontWeight: 500 } as const;
