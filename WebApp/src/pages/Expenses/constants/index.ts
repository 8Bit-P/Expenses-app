import { format, startOfMonth, endOfMonth } from "date-fns";
import type { TransactionFilters } from "../../../types/expenses";

export const PAGE_SIZE = 10;

const _now = new Date();

/** Default filter: the current calendar month. Used as the initial state in ExpensesContext. */
export const DEFAULT_FILTERS: TransactionFilters = {
  startDate: format(startOfMonth(_now), "yyyy-MM-dd"),
  endDate: format(endOfMonth(_now), "yyyy-MM-dd"),
};
