import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { useInvestments } from "../../../hooks/useInvestments";
import type { AssetWithSnapshots, AssetType } from "../../../types/investments";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";

// ==========================================
// 1. THE CUSTOM HOOK (Logic Separation)
// ==========================================
function useSnapshotForm(assets: AssetWithSnapshots[], onClose: () => void) {
  const { t } = useTranslation();
  const { createAsset, createSnapshot } = useInvestments();

  // Tabs & Modes
  const [activeTab, setActiveTab] = useState<"snapshot" | "new_asset">("snapshot");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Asset State
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetType, setNewAssetType] = useState<AssetType>("fund");
  const [initialValue, setInitialValue] = useState("");

  // Snapshot State
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [totalValue, setTotalValue] = useState("");
  const [movementType, setMovementType] = useState<"none" | "in" | "out">("none");
  const [movementAmount, setMovementAmount] = useState("");
  const [snapshotDate, setSnapshotDate] = useState(new Date().toISOString().split("T")[0]);

  // Auto-select first asset or force "new_asset" tab if vault is empty
  useEffect(() => {
    if (assets.length === 0) {
      setActiveTab("new_asset");
    } else if (!selectedAssetId) {
      setSelectedAssetId(assets[0].id);
      setActiveTab("snapshot");
    }
  }, [assets, selectedAssetId]);

  // Derived State: Calculate Real-Time Growth Preview
  const preview = useMemo(() => {
    const asset = assets.find((a) => a.id === selectedAssetId);
    const lastSnapshot = asset?.asset_snapshots?.[0];
    const prevValue = lastSnapshot ? Number(lastSnapshot.total_value) : 0;

    const newVal = Number(totalValue) || 0;
    const moveAmt = Number(movementAmount) || 0;
    const netContribution = movementType === "in" ? moveAmt : movementType === "out" ? -moveAmt : 0;

    // Growth = New Balance - Old Balance - Net Contributions
    const organicGrowth = newVal > 0 ? newVal - prevValue - netContribution : 0;

    return {
      prevValue,
      lastDate: lastSnapshot ? lastSnapshot.date : null,
      organicGrowth,
      isPositive: organicGrowth >= 0,
    };
  }, [assets, selectedAssetId, totalValue, movementType, movementAmount]);

  // Handlers
  const submitNewAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName) return;
    setIsSubmitting(true);
    try {
      const created = await createAsset.mutateAsync({
        name: newAssetName,
        type: newAssetType,
        initialValue: Number(initialValue) || 0,
      });
      toast.success(t("investments.logModal.newAsset.toast.success"), { 
        description: t("investments.logModal.newAsset.toast.successDesc", { name: newAssetName }) 
      });
      setNewAssetName("");
      setInitialValue("");
      setSelectedAssetId(created.id);
      setActiveTab("snapshot");
    } catch (error: any) {
      toast.error(t("investments.logModal.newAsset.toast.error"), { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId || !totalValue) return;
    setIsSubmitting(true);
    try {
      const moveAmt = Number(movementAmount) || 0;
      const netContribution = movementType === "in" ? moveAmt : movementType === "out" ? -moveAmt : 0;

      await createSnapshot.mutateAsync({
        asset_id: selectedAssetId,
        date: snapshotDate,
        total_value: Number(totalValue),
        contribution: netContribution,
      });

      toast.success(t("investments.logModal.snapshot.toast.success"), { 
        description: t("investments.logModal.snapshot.toast.successDesc") 
      });
      // Reset form on success
      setTotalValue("");
      setMovementType("none");
      setMovementAmount("");
      onClose();
    } catch (error: any) {
      toast.error(t("investments.logModal.snapshot.toast.error"), { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    isSubmitting,
    preview,
    newAsset: {
      name: newAssetName,
      setName: setNewAssetName,
      type: newAssetType,
      setType: setNewAssetType,
      initialValue: initialValue,
      setInitialValue: setInitialValue,
      submit: submitNewAsset,
    },
    snapshot: {
      assetId: selectedAssetId,
      setAssetId: setSelectedAssetId,
      value: totalValue,
      setValue: setTotalValue,
      moveType: movementType,
      setMoveType: setMovementType,
      moveAmt: movementAmount,
      setMoveAmt: setMovementAmount,
      date: snapshotDate,
      setDate: setSnapshotDate,
      submit: submitSnapshot,
    },
  };
}

// ==========================================
// 2. THE UI COMPONENT
// ==========================================
interface LogSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: AssetWithSnapshots[];
}

export default function LogSnapshotModal({ isOpen, onClose, assets }: LogSnapshotModalProps) {
  const { t, i18n } = useTranslation();
  const { currency } = useUserPreferences();
  const form = useSnapshotForm(assets, onClose);

  const dateLocale = i18n.language === "es" ? es : enUS;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Dark Ethereal Backdrop */}
      <div
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-surface-container-lowest/95 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/20 ring-1 ring-black/5 animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 flex flex-col max-h-[90vh]">
        {/* Header & Tabs */}
        <div className="p-6 md:p-8 border-b border-outline-variant/10 shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black font-headline text-on-surface tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">add_chart</span>
              {t("investments.logModal.title")}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-highest transition-colors text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Segmented Control Tabs */}
          <div className="flex p-1 bg-surface-container-low rounded-xl">
            <button
              onClick={() => form.setActiveTab("snapshot")}
              disabled={assets.length === 0}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${form.activeTab === "snapshot" ? "bg-surface-container-lowest text-on-surface shadow-sm ring-1 ring-outline-variant/10" : "text-on-surface-variant hover:text-on-surface disabled:opacity-30"}`}
            >
              {t("investments.logModal.tabs.log")}
            </button>
            <button
              onClick={() => form.setActiveTab("new_asset")}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${form.activeTab === "new_asset" ? "bg-surface-container-lowest text-on-surface shadow-sm ring-1 ring-outline-variant/10" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              {t("investments.logModal.tabs.new")}
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 md:p-8 overflow-y-auto">
          {form.activeTab === "new_asset" ? (
            // --- NEW ASSET FLOW ---
            <form onSubmit={form.newAsset.submit} className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                  {t("investments.logModal.newAsset.nameLabel")}
                </label>
                <input
                  autoFocus
                  placeholder={t("investments.logModal.newAsset.namePlaceholder")}
                  className="w-full bg-surface-container-low border-none rounded-2xl px-5 py-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                  value={form.newAsset.name}
                  onChange={(e) => form.newAsset.setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                  {t("investments.logModal.newAsset.initialLabel")}
                </label>
                <div className="relative flex items-center bg-primary/5 rounded-2xl border border-primary/20 focus-within:border-primary/50 transition-all p-1">
                  <span className="absolute left-4 text-xl font-black text-primary">{currency.symbol}</span>
                  <input
                    className="w-full bg-transparent border-none py-3.5 pl-10 pr-4 text-xl font-black text-on-surface placeholder:text-on-surface-variant/30 outline-none focus:ring-0"
                    placeholder={t("investments.logModal.newAsset.initialPlaceholder")}
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.newAsset.initialValue}
                    onChange={(e) => form.newAsset.setInitialValue(e.target.value)}
                  />
                </div>
                <p className="text-[10px] font-semibold text-on-surface-variant/60 ml-2 mt-1">
                  {t("investments.logModal.newAsset.initialDesc")}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                  {t("investments.logModal.newAsset.classLabel")}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "fund", icon: "pie_chart", label: t("investments.logModal.newAsset.types.fund") },
                    { id: "stock", icon: "trending_up", label: t("investments.logModal.newAsset.types.stock") },
                    { id: "crypto", icon: "currency_bitcoin", label: t("investments.logModal.newAsset.types.crypto") },
                    { id: "real_estate", icon: "real_estate_agent", label: t("investments.logModal.newAsset.types.real_estate") },
                    { id: "cash", icon: "payments", label: t("investments.logModal.newAsset.types.cash") },
                    { id: "other", icon: "category", label: t("investments.logModal.newAsset.types.other") },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => form.newAsset.setType(type.id as AssetType)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${form.newAsset.type === type.id ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-outline-variant/20 text-on-surface-variant hover:bg-surface-container"}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{type.icon}</span>
                      <span className="text-sm font-bold">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={form.isSubmitting || !form.newAsset.name}
                className="w-full py-4 rounded-2xl font-black text-sm text-on-primary bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 mt-4"
              >
                {form.isSubmitting ? t("investments.logModal.newAsset.creating") : t("investments.logModal.newAsset.createButton")}
              </button>
            </form>
          ) : (
            // --- LOG SNAPSHOT FLOW ---
            <form onSubmit={form.snapshot.submit} className="space-y-6 animate-in fade-in slide-in-from-left-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                  {t("investments.logModal.snapshot.targetLabel")}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {assets.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => form.snapshot.setAssetId(asset.id)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1.5 ${form.snapshot.assetId === asset.id ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-outline-variant/20 text-on-surface-variant hover:bg-surface-container"}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {asset.type === "crypto" ? "currency_bitcoin" : asset.type === "stock" ? "trending_up" : "pie_chart"}
                      </span>
                      <span className="truncate w-full">{asset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-end justify-between ml-1 mb-1">
                  <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant">
                    {t("investments.logModal.snapshot.valueLabel")}
                  </label>
                  {form.preview.prevValue > 0 && (
                    <span className="text-[10px] font-bold text-on-surface-variant/60">
                      {t("investments.logModal.snapshot.previousValue", { symbol: currency.symbol, value: form.preview.prevValue.toLocaleString() })}
                      {form.preview.lastDate &&
                        ` (${formatDistanceToNow(new Date(form.preview.lastDate), { addSuffix: true, locale: dateLocale })})`}
                    </span>
                  )}
                </div>
                <div className="relative flex items-center bg-primary/5 rounded-2xl border border-primary/20 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all overflow-hidden">
                  <span className="absolute left-5 text-2xl font-black text-primary">{currency.symbol}</span>
                  <input
                    className="w-full bg-transparent border-none py-5 pl-12 pr-5 text-3xl font-black text-on-surface placeholder:text-on-surface-variant/30 outline-none focus:ring-0"
                    placeholder={t("investments.logModal.snapshot.valuePlaceholder")}
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.snapshot.value}
                    onChange={(e) => form.snapshot.setValue(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-surface-container-low space-y-4">
                <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant">
                  {t("investments.logModal.snapshot.movementLabel")}
                </label>

                <div className="flex bg-surface-container p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => form.snapshot.setMoveType("none")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${form.snapshot.moveType === "none" ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant"}`}
                  >
                    {t("investments.logModal.snapshot.moveNone")}
                  </button>
                  <button
                    type="button"
                    onClick={() => form.snapshot.setMoveType("in")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${form.snapshot.moveType === "in" ? "bg-emerald-500 text-white shadow-sm" : "text-on-surface-variant"}`}
                  >
                    {t("investments.logModal.snapshot.moveDeposit")}
                  </button>
                  <button
                    type="button"
                    onClick={() => form.snapshot.setMoveType("out")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${form.snapshot.moveType === "out" ? "bg-error text-white shadow-sm" : "text-on-surface-variant"}`}
                  >
                    {t("investments.logModal.snapshot.moveWithdraw")}
                  </button>
                </div>

                {form.snapshot.moveType !== "none" && (
                  <div className="relative animate-in slide-in-from-top-2 fade-in">
                    <span
                      className={`absolute left-4 top-1/2 -translate-y-1/2 font-black ${form.snapshot.moveType === "in" ? "text-emerald-500" : "text-error"}`}
                    >
                      {currency.symbol}
                    </span>
                    <input
                      className="w-full bg-surface-container-lowest border-none rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder={t("investments.logModal.snapshot.movePlaceholder")}
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.snapshot.moveAmt}
                      onChange={(e) => form.snapshot.setMoveAmt(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Dynamic Growth Preview Card */}
              {form.snapshot.value && form.preview.prevValue > 0 && (
                <div
                  className={`p-4 rounded-2xl flex items-center justify-between border animate-in slide-in-from-bottom-2 fade-in ${form.preview.isPositive ? "bg-emerald-500/10 border-emerald-500/20" : "bg-error/10 border-error/20"}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`material-symbols-outlined ${form.preview.isPositive ? "text-emerald-500" : "text-error"}`}
                    >
                      {form.preview.isPositive ? "trending_up" : "trending_down"}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                      {t("investments.logModal.snapshot.growthLabel")}
                    </span>
                  </div>
                  <span
                    className={`font-black tracking-tight ${form.preview.isPositive ? "text-emerald-500" : "text-error"}`}
                  >
                    {form.preview.isPositive ? "+" : "-"}
                    {currency.symbol}
                    {Math.abs(form.preview.organicGrowth).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={form.isSubmitting || !form.snapshot.assetId || !form.snapshot.value}
                  className="w-full py-4 rounded-2xl font-black text-sm text-on-primary bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {form.isSubmitting ? t("investments.logModal.snapshot.confirming") : t("investments.logModal.snapshot.confirmButton")}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
