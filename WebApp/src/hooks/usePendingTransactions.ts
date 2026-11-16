import { useTransactions } from "./useTransactions";

export function usePendingTransactions() {
  return useTransactions({ needsReview: true, pageSize: 50 }, false);
}
