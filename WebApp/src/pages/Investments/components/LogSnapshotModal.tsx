import { useState, useEffect } from "react";
import { CustomSelect } from "../../../components/ui/CustomSelect";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { useInvestments } from "../../../hooks/useInvestments";
import type { AssetWithSnapshots, AssetType } from "../../../types/investments";
import { toast } from "sonner";

interface LogSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Passing assets here to easily form the select list
  assets: AssetWithSnapshots[];
}

export default function LogSnapshotModal({ isOpen, onClose, assets }: LogSnapshotModalProps) {
  const { currency } = useUserPreferences();
  const { createAsset, createSnapshot } = useInvestments();

  // Mode: "snapshot" (default) or "new_asset"
  const [mode, setMode] = useState<"snapshot" | "new_asset">("snapshot");

  // Flow 1: New Asset State
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetType, setNewAssetType] = useState<AssetType>("fund");

  // Flow 2: Snapshot State
  // Default to first asset if available
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [totalValue, setTotalValue] = useState("");
  const [movementType, setMovementType] = useState<"none" | "contribution" | "withdrawal">("none");
  const [movementAmount, setMovementAmount] = useState("");
  const [snapshotDate, setSnapshotDate] = useState(new Date().toISOString().split("T")[0]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state cleanly when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(assets.length === 0 ? "new_asset" : "snapshot");
      setSelectedAssetId(assets.length > 0 ? assets[0].id : "");
      setTotalValue("");
      setMovementType("none");
      setMovementAmount("");
      setSnapshotDate(new Date().toISOString().split("T")[0]);
      setNewAssetName("");
      setNewAssetType("fund");
    }
  }, [isOpen, assets.length]); // Added assets.length to quickly auto-switch if they delete all

  if (!isOpen) return null;

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName || !newAssetType) return;
    
    setIsSubmitting(true);
    try {
      const created = await createAsset.mutateAsync({
        name: newAssetName,
        type: newAssetType,
      });
      toast.success("Asset added", { description: `${newAssetName} is now tracked.` });
      // Switch back to snapshot mode and preselect the new asset
      setMode("snapshot");
      setSelectedAssetId(created.id);
    } catch (error: any) {
      toast.error("Failed to create", { description: error.message || "Could not add asset." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId || !totalValue) return;

    setIsSubmitting(true);
    try {
      // Calculate contribution positive/negative
      let finalContribution = 0;
      if (movementType !== "none" && movementAmount) {
        const amt = parseFloat(movementAmount);
        finalContribution = movementType === "contribution" ? amt : -amt;
      }

      await createSnapshot.mutateAsync({
        asset_id: selectedAssetId,
        date: snapshotDate,
        total_value: parseFloat(totalValue),
        contribution: finalContribution,
      });

      toast.success("Snapshot logged", { description: "Your vault timeline has been updated." });
      onClose();
    } catch (error: any) {
      toast.error("Failed to log", { description: error.message || "Could not save your snapshot." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-md bg-surface-container-lowest/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-outline-variant/20 ring-1 ring-black/5 animate-in zoom-in-95 slide-in-from-bottom-8 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {mode === "new_asset" ? "account_balance" : "add_chart"}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold font-headline text-on-surface tracking-tight">
                {mode === "new_asset" ? "Add Vault Asset" : "Log Snapshot"}
              </h2>
              <p className="text-on-surface-variant text-sm font-medium">
                {mode === "new_asset" ? "Track a new class of wealth." : "Update your portfolio's current value."}
              </p>
            </div>
          </div>

          {mode === "new_asset" ? (
            <form onSubmit={handleCreateAsset} className="space-y-6 animate-in slide-in-from-right-4 fade-in">
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                  Asset Name
                </label>
                <input
                  autoFocus
                  className="w-full bg-surface-container border-none rounded-xl px-4 py-3.5 text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant/50 outline-none"
                  placeholder="e.g., Malaga Beach House"
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  type="text"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                  Asset Class
                </label>
                <CustomSelect
                  value={newAssetType}
                  options={[
                    { value: "fund", label: "Index Fund" },
                    { value: "stock", label: "Stock" },
                    { value: "crypto", label: "Cryptocurrency" },
                    { value: "real_estate", label: "Real Estate" },
                    { value: "cash", label: "Cash / Bank Account" },
                    { value: "other", label: "Other Asset" },
                  ]}
                  onChange={(val: string) => setNewAssetType(val as AssetType)}
                  className="w-full"
                />
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-outline-variant/10">
                {assets.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setMode("snapshot")}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container transition-all"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting || !newAssetName}
                  className="flex-2 w-full py-3 px-4 rounded-xl font-bold text-sm text-on-primary bg-primary hover:opacity-90 active:scale-[0.98] transition-all shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Create Asset"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCreateSnapshot} className="space-y-6 animate-in slide-in-from-left-4 fade-in">
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                  Select Asset
                </label>
                <CustomSelect
                  value={selectedAssetId}
                  options={assets.map((a) => ({ value: a.id, label: a.name }))}
                  onChange={setSelectedAssetId}
                  onAddAction={() => setMode("new_asset")}
                  addActionLabel="Create New Asset"
                  className="w-full"
                />
              </div>

              <div className="space-y-2 relative z-50">
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1 border-b border-transparent">
                  Current Total Value
                </label>
                <div className="relative flex items-center bg-primary/5 rounded-xl border border-primary/20 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all p-1">
                  <span className="absolute left-4 text-xl font-black text-primary">{currency.symbol}</span>
                  <input
                    className="w-full bg-transparent border-none py-3.5 pl-10 pr-4 text-xl font-black text-on-surface placeholder:text-on-surface-variant/30 outline-none focus:ring-0"
                    placeholder="0.00"
                    value={totalValue}
                    onChange={(e) => setTotalValue(e.target.value)}
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </div>
                <p className="text-xs font-bold text-on-surface-variant/70 mt-1 ml-1 px-1">
                  Input the entire current worth.
                </p>
              </div>

              {/* Movement Toggle */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                  Did cash move in or out? (Optional)
                </label>
                <div className="flex bg-surface-container-low p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setMovementType("none")}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-300 ${movementType === "none" ? "bg-surface-container-highest text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => setMovementType("contribution")}
                    className={`flex-1 flex justify-center gap-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-300 ${movementType === "contribution" ? "bg-emerald-500 text-white shadow-sm" : "text-on-surface-variant hover:text-emerald-500"}`}
                  >
                    In <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMovementType("withdrawal")}
                    className={`flex-1 flex justify-center gap-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-300 ${movementType === "withdrawal" ? "bg-error text-white shadow-sm" : "text-on-surface-variant hover:text-error"}`}
                  >
                    Out <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  </button>
                </div>
              </div>

              {movementType !== "none" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                    Movement Amount
                  </label>
                  <div className="relative flex items-center">
                    <span className={`absolute left-4 text-sm font-bold ${movementType === "contribution" ? "text-emerald-500" : "text-error"}`}>
                      {movementType === "contribution" ? "+" : "-"} {currency.symbol}
                    </span>
                    <input
                      className="w-full bg-surface-container border-none rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant/30 outline-none"
                      placeholder="0.00"
                      value={movementAmount}
                      onChange={(e) => setMovementAmount(e.target.value)}
                      type="number"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                  Snapshot Date
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container border-none rounded-xl px-4 py-3.5 text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                    value={snapshotDate}
                    onChange={(e) => setSnapshotDate(e.target.value)}
                    type="date"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-outline-variant/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container transition-all line-clamp-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedAssetId || !totalValue}
                  className="flex-[2] py-3 px-4 rounded-xl font-bold text-sm text-on-primary bg-primary hover:opacity-90 active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 line-clamp-1"
                >
                  {isSubmitting ? "Logging..." : "Confirm Snapshot"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
