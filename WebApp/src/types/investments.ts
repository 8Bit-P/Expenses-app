export type AssetType = "cash" | "fund" | "stock" | "crypto" | "real_estate" | "other";

export interface Asset {
  id: string;
  user_id: string;
  name: string;
  type: AssetType;
  created_at: string;
}

export interface AssetSnapshot {
  id: string;
  asset_id: string;
  date: string;
  total_value: number;
  contribution: number;
  created_at: string;
}

// Utility type for frontend computation
export interface AssetWithSnapshots extends Asset {
  asset_snapshots: AssetSnapshot[];
}
