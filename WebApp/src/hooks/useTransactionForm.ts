import { useState } from "react";
import { useCategories } from "./useCategories";
import { useTransactions } from "./useTransactions";
import { useUserPreferences } from "../context/UserPreferencesContext";
import { toast } from "sonner";
import type { TransactionType } from "../types/expenses";
import { useTranslation } from "react-i18next";

interface TransactionFormState {
  type: TransactionType;
  amount: string;
  description: string;
  categoryId: string;
  accountId: string;
  date: string;
  needsReview: boolean;
}

export function useTransactionForm(transaction?: any) {
  const { t } = useTranslation();
  const { getOrCreateUnknownCategory } = useCategories();
  const { addTransaction, updateTransaction } = useTransactions();
  const { currency } = useUserPreferences();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (state: TransactionFormState, onClose: () => void) => {
    if (!state.amount) return;

    setIsSubmitting(true);
    let finalCategoryId = state.categoryId;

    try {
      // 1. Fallback for category if missing
      if (!finalCategoryId) {
        finalCategoryId = await getOrCreateUnknownCategory();
      }

      const data = {
        type: state.type,
        amount: parseFloat(state.amount),
        description: state.description,
        category_id: finalCategoryId || null,
        account_id: state.accountId || null,
        date: state.date,
        needs_review: state.needsReview,
      };

      if (transaction) {
        await updateTransaction({ id: transaction.id, updates: data as any });
      } else {
        await addTransaction(data as any);
      }

      toast.success(
        transaction
          ? t("expenses.transactionModal.toasts.updated")
          : t("expenses.transactionModal.toasts.recorded"),
        {
          description: t("expenses.transactionModal.toasts.secured", {
            description:
              state.description ||
              (state.type === "expense"
                ? t("expenses.transactionModal.types.expense")
                : t("expenses.transactionModal.types.income")),
            symbol: currency.symbol,
            amount: state.amount,
          }),
        }
      );

      onClose();
    } catch (err: any) {
      toast.error(t("expenses.transactionModal.toasts.saveFailed"), {
        description: err.message || t("expenses.transactionModal.toasts.saveFailedDefault"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSave, isSubmitting };
}
