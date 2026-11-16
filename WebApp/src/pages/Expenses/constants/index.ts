import { format, startOfMonth, endOfMonth } from "date-fns";
import type { TransactionFilters } from "../../../types/expenses";

export const PAGE_SIZE = 10;

/** Shared column template for the desktop transaction table (header, day rows and transaction rows). */
export const FLOW_GRID_COLS = "md:grid md:grid-cols-[minmax(0,1fr)_200px_140px_80px] md:gap-4";

const _now = new Date();

/** Default filter: the current calendar month. Used as the initial state in ExpensesContext. */
export const DEFAULT_FILTERS: TransactionFilters = {
  startDate: format(startOfMonth(_now), "yyyy-MM-dd"),
  endDate: format(endOfMonth(_now), "yyyy-MM-dd"),
};
