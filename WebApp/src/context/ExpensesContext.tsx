import { createContext, useContext, useState, type ReactNode } from 'react';
import type { TransactionFilters } from '../types/expenses';
import { useTransactions as useTransactionsHook } from '../hooks/useTransactions';
import { PAGE_SIZE, DEFAULT_FILTERS } from '../pages/Expenses/constants';

interface ExpensesContextType {
  filters: TransactionFilters;
  setFilters: (filters: TransactionFilters) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  transactions: ReturnType<typeof useTransactionsHook>['transactions'];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  addTransaction: ReturnType<typeof useTransactionsHook>['addTransaction'];
  updateTransaction: ReturnType<typeof useTransactionsHook>['updateTransaction'];
  deleteTransaction: ReturnType<typeof useTransactionsHook>['deleteTransaction'];
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<TransactionFilters>(DEFAULT_FILTERS);
  const [page, setPageState] = useState(1);

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
  } = useTransactionsHook(activeFilters);

  const setFilters = (newFilters: TransactionFilters) => {
    setFiltersState(newFilters);
    setPageState(1);
  };

  const setPage = (newPage: number) => {
    setPageState(Math.max(1, Math.min(newPage, totalPages)));
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
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
}
