import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { TransactionFilters } from "../types/expenses";
import { useTransactions as useTransactionsHook } from "../hooks/useTransactions";
import { DEFAULT_FILTERS, PAGE_SIZE } from "../pages/Expenses/constants";

interface ExpensesContextType {
  filters: TransactionFilters;
  setFilters: (filters: TransactionFilters) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  transactions: any[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  addTransaction: (tx: any) => Promise<any>;
  updateTransaction: (data: { id: string; updates: any }) => Promise<any>;
  deleteTransaction: (id: string) => Promise<boolean>;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  isMobile: boolean;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<TransactionFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    setIsMobile(mql.matches);
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, []);

  const activeFilters: TransactionFilters = { ...filters, page, pageSize: PAGE_SIZE };

  const {
    transactions,
    totalCount,
    totalPages,
    loading,
    error,
    refetch,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactionsHook(activeFilters, isMobile); // Pass isMobile as isInfinite

  const setFilters = (newFilters: TransactionFilters) => {
    setFiltersState(newFilters);
    setPage(1);
  };

  return (
    <ExpensesContext.Provider
      value={{
        filters,
        setFilters,
        page,
        setPage,
        pageSize: PAGE_SIZE,
        totalPages,
        totalCount,
        transactions,
        loading,
        error,
        refetch,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        isFilterOpen,
        setIsFilterOpen,
        isMobile,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpensesProvider");
  }
  return context;
}
