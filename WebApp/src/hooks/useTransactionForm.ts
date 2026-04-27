import { useState } from "react";
import { useCategories } from "./useCategories";
import { useTransactions } from "./useTransactions";
import { useUserPreferences } from "../context/UserPreferencesContext";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import type { TransactionType } from "../types/expenses";

interface TransactionFormState {
  type: TransactionType;
  amount: string;
  description: string;
  categoryId: string;
  reserveId: string;
  date: string;
  needsReview: boolean;
}

export function useTransactionForm(transaction?: any) {
  const { getOrCreateUnknownCategory } = useCategories();
  const { addTransaction, updateTransaction } = useTransactions();
  const { currency } = useUserPreferences();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (state: TransactionFormState, onClose: () => void) => {
    if (!state.amount) return;

    setIsSubmitting(true);
    let finalCategoryId = state.categoryId;

    try {
      // 1. Fallback for category if missing (and not a transfer)
      if (!finalCategoryId && state.type !== "transfer") {
        finalCategoryId = await getOrCreateUnknownCategory();
      }

      const data = {
        type: state.type,
        amount: parseFloat(state.amount),
        description: state.description,
        category_id: state.type === "transfer" ? null : finalCategoryId,
        reserve_id: state.type === "transfer" ? state.reserveId : null,
        date: state.date,
        needs_review: state.needsReview,
      };

      if (transaction) {
        // 2. Handle Delta Math Sync for Transfers
        // If it was a transfer and still is, or became one, handle the math sync
        if (state.type === "transfer" && state.reserveId) {
          const oldAmount = transaction.amount;
          const newAmount = parseFloat(state.amount);
          const delta = newAmount - oldAmount;

          if (delta !== 0) {
            // Fetch current reserve amount to apply the delta correctly
            const { data: reserveData } = await supabase
              .from("reserves")
              .select("current_amount")
              .eq("id", state.reserveId)
              .single();

            await supabase
              .from("reserves")
              .update({ current_amount: (reserveData?.current_amount || 0) + delta })
              .eq("id", state.reserveId);
          }
        }
        await updateTransaction({ id: transaction.id, updates: data as any });
      } else {
        // 3. New Transaction entry
        await addTransaction(data as any);
      }

      toast.success(transaction ? "Transaction updated" : "Transaction recorded", {
        description: `${state.description || (state.type === "expense" ? "Expense" : "Income")} of ${currency.symbol}${state.amount} secured.`,
      });

      onClose();
    } catch (err: any) {
      toast.error("Save failed", {
        description: err.message || "Something went wrong while saving.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSave, isSubmitting };
}
