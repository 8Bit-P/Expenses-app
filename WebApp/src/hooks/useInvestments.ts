import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import type { Asset, AssetSnapshot, AssetWithSnapshots } from "../types/investments";
import { toast } from "sonner";

export function useInvestments() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const userId = session?.user?.id;

  // Fetch Assets with their Snapshots
  const {
    data: assets = [],
    isLoading,
    error,
  } = useQuery<AssetWithSnapshots[]>({
    queryKey: ["investments", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("assets")
        .select(
          `
          *,
          asset_snapshots (
            id,
            asset_id,
            date,
            total_value,
            contribution,
            created_at
          )
        `,
        )
        .eq("user_id", userId)
        // Order assets by creation date
        .order("created_at", { ascending: true })
        .order("date", { referencedTable: "asset_snapshots", ascending: false });

      if (error) {
        console.error("Error fetching investments:", error);
        throw error;
      }

      // Sort snapshots by date descending (latest first) manually inside JS for reliability
      const structuredData: AssetWithSnapshots[] = (data as any[]).map((asset) => ({
        ...asset,
        asset_snapshots: asset.asset_snapshots.sort(
          (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
      }));

      return structuredData;
    },
    enabled: !!userId,
  });

  // Computed Metrics
  let totalValue = 0;
  let totalInvested = 0;

  assets.forEach((asset) => {
    // Latest snapshot is the first one because we sorted by date descending
    const latestSnapshot = asset.asset_snapshots[0];
    if (latestSnapshot) {
      totalValue += Number(latestSnapshot.total_value);
    }

    // Sum all contributions across all time for this asset
    const assetInvested = asset.asset_snapshots.reduce((sum, snap) => sum + Number(snap.contribution || 0), 0);
    totalInvested += assetInvested;
  });

  let roi = 0;
  if (totalInvested > 0) {
    roi = ((totalValue - totalInvested) / totalInvested) * 100;
  } else if (totalInvested <= 0 && totalValue > 0) {
    roi = 100;
  }

  // 3. Mutations
  const createAsset = useMutation({
    mutationFn: async (newAsset: Omit<Asset, "id" | "user_id" | "created_at">) => {
      if (!userId) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("assets")
        .insert([{ ...newAsset, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments", userId] });
    },
  });

  const createSnapshot = useMutation({
    mutationFn: async (newSnapshot: Omit<AssetSnapshot, "id" | "created_at">) => {
      if (!userId) throw new Error("User not authenticated");

      const { data, error } = await supabase.from("asset_snapshots").insert([newSnapshot]).select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments", userId] });
    },
    onError: (error) => {
      toast.error("Failed to update vault", {
        description: error.message,
      });
    },
  });

  return {
    assets,
    isLoading,
    error,
    metrics: {
      totalValue,
      totalInvested,
      roi,
    },
    createAsset,
    createSnapshot,
  };
}
