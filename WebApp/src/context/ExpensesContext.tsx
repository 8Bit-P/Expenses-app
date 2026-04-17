import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Transaction, TransactionFilters } from '../types/expenses';
import { useTransactions as useTransactionsHook } from '../hooks/useTransactions';

interface ExpensesContextType {
  filters: TransactionFilters;
  setFilters: (filters: TransactionFilters) => void;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  addTransaction: (tx: any) => Promise<any>;
  updateTransaction: (id: string, updates: any) => Promise<any>;
  deleteTransaction: (id: string) => Promise<any>;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<TransactionFilters>({});
  
  const { 
    transactions, 
    loading, 
    error, 
    refetch, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction 
  } = useTransactionsHook(filters);

  return (
    <ExpensesContext.Provider value={{ 
      filters, 
      setFilters, 
      transactions, 
      loading, 
      error, 
      refresh: refetch,
      addTransaction,
      updateTransaction,
      deleteTransaction
    }}>
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
