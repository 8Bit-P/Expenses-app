import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Transaction, TransactionFilters } from '../types/expenses';

export function useTransactions(filters?: TransactionFilters) {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

  // --- 1. FETCH TRANSACTIONS ---
  const { 
    data: transactions = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    // Adding filters to the queryKey means React Query will automatically 
    // refetch and cache separate results whenever a filter changes!
    queryKey: ['transactions', userId, filters],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select('*, category:categories(*)')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (filters?.startDate) query = query.gte('date', filters.startDate);
      if (filters?.endDate) query = query.lte('date', filters.endDate);
      if (filters?.categoryId) query = query.eq('category_id', filters.categoryId);
      if (filters?.type) query = query.eq('type', filters.type);
      if (filters?.search) query = query.ilike('description', `%${filters.search}%`);

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data as Transaction[];
    },
    enabled: !!userId,
  });

  // --- 2. ADD TRANSACTION ---
  const addTransaction = useMutation({
    mutationFn: async (transaction: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) => {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...transaction, user_id: userId }])
        .select('*, category:categories(*)')
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      // Magically refresh the transactions list after a successful insert
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });

  // --- 3. UPDATE TRANSACTION ---
  const updateTransaction = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Transaction> }) => {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select('*, category:categories(*)')
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });

  // --- 4. DELETE TRANSACTION ---
  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });

  return { 
    transactions, 
    loading: isLoading, 
    error: error?.message || null, 
    refetch,
    // We expose the .mutateAsync functions so you can still `await` them in your components if needed
    addTransaction: addTransaction.mutateAsync,
    updateTransaction: updateTransaction.mutateAsync,
    deleteTransaction: deleteTransaction.mutateAsync
  };
}