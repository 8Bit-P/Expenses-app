import { useMemo } from "react";
import { useTransactions } from "./useTransactions";
import { useInvestments } from "./useInvestments";
import type { Transaction } from "../types/expenses";
import type { AssetSnapshot } from "../types/investments";

export type ActivityItem =
  | { type: "transaction"; data: Transaction }
  | { type: "snapshot"; data: AssetSnapshot & { assetName: string } };

export function useRecentActivity(limit = 6) {
  const { transactions, loading: txLoading, error: txError } = useTransactions({ pageSize: 20 });
  const { assets, isLoading: invLoading, error: invError } = useInvestments();

  const activity = useMemo(() => {
    const items: ActivityItem[] = [];

    // Add transactions
    transactions.forEach((tx) => {
      items.push({ type: "transaction", data: tx });
    });

    // Add snapshots
    assets.forEach((asset) => {
      asset.asset_snapshots.forEach((snap) => {
        items.push({ type: "snapshot", data: { ...snap, assetName: asset.name } });
      });
    });

    // Sort by date descending
    return items
      .sort((a, b) => {
        const dateA = new Date(a.data.date).getTime();
        const dateB = new Date(b.data.date).getTime();

        if (dateA !== dateB) return dateB - dateA;

        // Tie-breaker: created_at
        const createA = new Date(a.data.created_at).getTime();
        const createB = new Date(b.data.created_at).getTime();
        return createB - createA;
      })
      .slice(0, limit);
  }, [transactions, assets, limit]);

  return {
    activity,
    loading: txLoading || invLoading,
    error: txError || (invError ? (invError as Error).message : null),
  };
}
