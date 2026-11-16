import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { Account, AccountWithBalance } from "../types/accounts";

export function useAccounts() {
  const { t } = useTranslation();
  const { session } = useAuth();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

  // Fetch accounts + all linked transactions to compute balance
  const {
    data: accounts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["accounts", userId],
    queryFn: async () => {
      // 1. Fetch accounts
      const { data: accountsData, error: accErr } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: true });

      if (accErr) throw accErr;
      if (!accountsData || accountsData.length === 0) return [] as AccountWithBalance[];

      // 2. Fetch all transactions that have an account_id for this user
      const accountIds = accountsData.map((a: Account) => a.id);
      const { data: txData, error: txErr } = await supabase
        .from("transactions")
        .select("account_id, type, amount")
        .eq("user_id", userId!)
        .in("account_id", accountIds);

      if (txErr) throw txErr;

      // 3. Compute balance per account
      const balanceMap: Record<string, number> = {};
      accountIds.forEach((id: string) => {
        balanceMap[id] = 0;
      });

      (txData || []).forEach((tx: { account_id: string; type: string; amount: number }) => {
        if (!tx.account_id) return;
        if (tx.type === "income") {
          balanceMap[tx.account_id] = (balanceMap[tx.account_id] || 0) + tx.amount;
        } else if (tx.type === "expense") {
          balanceMap[tx.account_id] = (balanceMap[tx.account_id] || 0) - tx.amount;
        }
      });

      return accountsData.map((acc: Account) => ({
        ...acc,
        balance: balanceMap[acc.id] ?? 0,
      })) as AccountWithBalance[];
    },
    enabled: !!userId,
  });

  const createAccount = useMutation({
    mutationFn: async (payload: { name: string; icon: string; color: string }) => {
      if (!userId) throw new Error("Authentication required");
      const { data, error } = await supabase
        .from("accounts")
        .insert([{ ...payload, user_id: userId }])
        .select()
        .single();
      if (error) throw error;
      return data as Account;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts", userId] });
      toast.success(t("accounts.toasts.created"));
    },
    onError: (err: Error) => {
      toast.error(t("accounts.toasts.createFailed"), { description: err.message });
    },
  });

  const updateAccount = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Pick<Account, "name" | "icon" | "color">> }) => {
      const { data, error } = await supabase
        .from("accounts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Account;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts", userId] });
      toast.success(t("accounts.toasts.updated"));
    },
    onError: (err: Error) => {
      toast.error(t("accounts.toasts.updateFailed"), { description: err.message });
    },
  });

  const deleteAccount = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("accounts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts", userId] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success(t("accounts.toasts.deleted"));
    },
    onError: (err: Error) => {
      toast.error(t("accounts.toasts.deleteFailed"), { description: err.message });
    },
  });

  return {
    accounts,
    isLoading,
    error,
    createAccount,
    updateAccount,
    deleteAccount,
  };
}
