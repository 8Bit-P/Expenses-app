import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import type { Transaction, TransactionFilters } from "../types/expenses";

const DEFAULT_PAGE_SIZE = 10;

export function useTransactions(filters?: TransactionFilters, isInfinite = false) {
  const { session } = useAuth();
  const userId = session?.user?.id;

  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? DEFAULT_PAGE_SIZE;
  
  // For infinite mode, we fetch from the beginning up to the current page's end
  const from = isInfinite ? 0 : (page - 1) * pageSize;
  const to = page * pageSize - 1;

  // --- 1. FETCH TRANSACTIONS ---
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["transactions", userId, filters, isInfinite], // isInfinite included in key
    queryFn: async () => {
      let query = supabase
        .from("transactions")
        .select("*, category:categories(*)", { count: "exact" })
        .eq("user_id", userId!)
        .order("date", { ascending: false });

      if (filters?.startDate) query = query.gte("date", filters.startDate);
      if (filters?.endDate) query = query.lte("date", filters.endDate);
      if (filters?.categoryId) query = query.eq("category_id", filters.categoryId);
      if (filters?.type) query = query.eq("type", filters.type);
      if (filters?.search) query = query.ilike("description", `%${filters.search}%`);

      // Apply range based on mode
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw new Error(error.message);
      
      const totalCount = count ?? 0;
      const totalPages = Math.ceil(totalCount / pageSize);

      return { transactions: (data as Transaction[]) ?? [], totalCount, totalPages };
    },
    enabled: !!userId,
    placeholderData: (prev) => prev,
  });

  const transactions = data?.transactions ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = data?.totalPages ?? 1;

  // --- MUTATIONS ---
  const { addTransaction, updateTransaction, deleteTransaction } = useTransactionMutations();

  return {
    transactions,
    totalCount,
    totalPages,
    loading: isLoading,
    error: error?.message ?? null,
    refetch,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}

export function useTransactionMutations() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

  const addTransaction = useMutation({
    mutationFn: async (transaction: Omit<Transaction, "id" | "created_at" | "user_id">) => {
      const { data, error } = await supabase
        .from("transactions")
        .insert([{ ...transaction, user_id: userId }])
        .select("*, category:categories(*)")
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const updateTransaction = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Transaction> }) => {
      const { data, error } = await supabase
        .from("transactions")
        .update(updates)
        .eq("id", id)
        .select("*, category:categories(*)")
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw new Error(error.message);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  return {
    addTransaction: addTransaction.mutateAsync,
    updateTransaction: updateTransaction.mutateAsync,
    deleteTransaction: deleteTransaction.mutateAsync,
  };
}
