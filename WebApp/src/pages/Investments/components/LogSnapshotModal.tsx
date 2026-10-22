import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { useInvestments } from "../../../hooks/useInvestments";
import type { AssetWithSnapshots, AssetType } from "../../../types/investments";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

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
      setSelectedAssetId(assets[0]?.id || "");
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
    } catch (error) {
      toast.error(t("investments.logModal.newAsset.toast.error"), { description: (error as Error).message });
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
    } catch (error) {
      toast.error(t("investments.logModal.snapshot.toast.error"), { description: (error as Error).message });
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

const labelClass = "block text-xs font-medium text-on-surface-variant mb-1.5";
const inputClass =
  "w-full h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface placeholder:text-outline focus:border-on-surface focus:ring-0 outline-none transition-colors";
const choiceClass = (selected: boolean) =>
  `flex items-center gap-2 h-10 px-3 rounded-lg border text-sm font-medium transition-colors min-w-0 ${
    selected
      ? "border-on-surface bg-surface-container-low text-on-surface"
      : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
  }`;
const segmentClass = (active: boolean, activeClass: string) =>
  `flex-1 h-8 px-3 rounded-md text-xs font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none ${
    active ? activeClass : "text-on-surface-variant hover:text-on-surface"
  }`;
const cancelButtonClass =
  "h-9 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors";
const primaryButtonClass =
  "h-9 px-4 rounded-lg bg-primary text-on-primary text-sm font-medium hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50 disabled:pointer-events-none";

export default function LogSnapshotModal({ isOpen, onClose, assets }: LogSnapshotModalProps) {
  const { t, i18n } = useTranslation();
  const { currency } = useUserPreferences();
  const form = useSnapshotForm(assets, onClose);

  const dateLocale = i18n.language === "es" ? es : enUS;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-lg bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header & Tabs */}
            <div className="px-5 pt-4 pb-4 border-b border-outline-variant shrink-0 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-[15px] font-semibold text-on-surface">{t("investments.logModal.title")}</h2>
                <button
                  onClick={onClose}
                  className="w-9 h-9 -mr-2 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                  aria-label={t("common.cancel")}
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Segmented Control Tabs */}
              <div className="flex p-0.5 rounded-lg bg-surface-container border border-outline-variant">
                <button
                  onClick={() => form.setActiveTab("snapshot")}
                  disabled={assets.length === 0}
                  className={segmentClass(form.activeTab === "snapshot", "bg-surface-container-lowest text-on-surface shadow-sm")}
                >
                  {t("investments.logModal.tabs.log")}
                </button>
                <button
                  onClick={() => form.setActiveTab("new_asset")}
                  className={segmentClass(form.activeTab === "new_asset", "bg-surface-container-lowest text-on-surface shadow-sm")}
                >
                  {t("investments.logModal.tabs.new")}
                </button>
              </div>
            </div>

            {/* Form Body + Footer */}
            <div className="flex-1 min-h-0 flex flex-col">
              <AnimatePresence mode="wait" initial={false}>
                {form.activeTab === "new_asset" ? (
                  // --- NEW ASSET FLOW ---
                  <motion.form
                    key="new_asset"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    onSubmit={form.newAsset.submit}
                    className="flex-1 min-h-0 flex flex-col"
                  >
                    <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
                      <div>
                        <label className={labelClass}>{t("investments.logModal.newAsset.nameLabel")}</label>
                        <input
                          autoFocus
                          placeholder={t("investments.logModal.newAsset.namePlaceholder")}
                          className={inputClass}
                          value={form.newAsset.name}
                          onChange={(e) => form.newAsset.setName(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>{t("investments.logModal.newAsset.initialLabel")}</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant pointer-events-none">
                            {currency.symbol}
                          </span>
                          <input
                            className={`${inputClass} pl-8 tabular-nums`}
                            placeholder={t("investments.logModal.newAsset.initialPlaceholder")}
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.newAsset.initialValue}
                            onChange={(e) => form.newAsset.setInitialValue(e.target.value)}
                          />
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1.5">
                          {t("investments.logModal.newAsset.initialDesc")}
                        </p>
                      </div>

                      <div>
                        <label className={labelClass}>{t("investments.logModal.newAsset.classLabel")}</label>
                        <div className="grid grid-cols-2 gap-2">
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
                              className={choiceClass(form.newAsset.type === type.id)}
                              aria-pressed={form.newAsset.type === type.id}
                            >
                              <span className="material-symbols-outlined text-[18px] shrink-0">{type.icon}</span>
                              <span className="truncate">{type.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex justify-end gap-2 px-5 py-3 border-t border-outline-variant">
                      <button type="button" onClick={onClose} className={cancelButtonClass}>
                        {t("common.cancel")}
                      </button>
                      <button
                        type="submit"
                        disabled={form.isSubmitting || !form.newAsset.name}
                        className={primaryButtonClass}
                      >
                        {form.isSubmitting ? t("investments.logModal.newAsset.creating") : t("investments.logModal.newAsset.createButton")}
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  // --- LOG SNAPSHOT FLOW ---
                  <motion.form
                    key="snapshot"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    onSubmit={form.snapshot.submit}
                    className="flex-1 min-h-0 flex flex-col"
                  >
                    <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
                      <div>
                        <label className={labelClass}>{t("investments.logModal.snapshot.targetLabel")}</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {assets.map((asset) => (
                            <button
                              key={asset.id}
                              type="button"
                              onClick={() => form.snapshot.setAssetId(asset.id)}
                              className={choiceClass(form.snapshot.assetId === asset.id)}
                              aria-pressed={form.snapshot.assetId === asset.id}
                            >
                              <span className="material-symbols-outlined text-[18px] shrink-0">
                                {asset.type === "crypto" ? "currency_bitcoin" : asset.type === "stock" ? "trending_up" : "pie_chart"}
                              </span>
                              <span className="truncate">{asset.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-baseline justify-between gap-3 mb-1.5">
                          <label className="text-xs font-medium text-on-surface-variant">
                            {t("investments.logModal.snapshot.valueLabel")}
                          </label>
                          {form.preview.prevValue > 0 && (
                            <span className="text-xs text-outline tabular-nums truncate">
                              {t("investments.logModal.snapshot.previousValue", { symbol: currency.symbol, value: form.preview.prevValue.toLocaleString() })}
                              {form.preview.lastDate &&
                                ` (${formatDistanceToNow(new Date(form.preview.lastDate), { addSuffix: true, locale: dateLocale })})`}
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant pointer-events-none">
                            {currency.symbol}
                          </span>
                          <input
                            className="w-full h-12 rounded-lg border border-outline-variant bg-surface-container-lowest pl-9 pr-3 text-2xl font-semibold tracking-tight tabular-nums text-on-surface placeholder:text-outline focus:border-on-surface focus:ring-0 outline-none transition-colors"
                            placeholder={t("investments.logModal.snapshot.valuePlaceholder")}
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.snapshot.value}
                            onChange={(e) => form.snapshot.setValue(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <label className="block text-xs font-medium text-on-surface-variant">
                          {t("investments.logModal.snapshot.movementLabel")}
                        </label>

                        <div className="flex p-0.5 rounded-lg bg-surface-container border border-outline-variant">
                          <button
                            type="button"
                            onClick={() => form.snapshot.setMoveType("none")}
                            className={segmentClass(form.snapshot.moveType === "none", "bg-surface-container-lowest text-on-surface shadow-sm")}
                          >
                            {t("investments.logModal.snapshot.moveNone")}
                          </button>
                          <button
                            type="button"
                            onClick={() => form.snapshot.setMoveType("in")}
                            className={segmentClass(form.snapshot.moveType === "in", "bg-secondary text-on-secondary shadow-sm")}
                          >
                            {t("investments.logModal.snapshot.moveDeposit")}
                          </button>
                          <button
                            type="button"
                            onClick={() => form.snapshot.setMoveType("out")}
                            className={segmentClass(form.snapshot.moveType === "out", "bg-error text-white shadow-sm")}
                          >
                            {t("investments.logModal.snapshot.moveWithdraw")}
                          </button>
                        </div>

                        <AnimatePresence initial={false}>
                          {form.snapshot.moveType !== "none" && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="relative">
                                <span
                                  className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium pointer-events-none ${form.snapshot.moveType === "in" ? "text-secondary" : "text-error"}`}
                                >
                                  {currency.symbol}
                                </span>
                                <input
                                  className={`${inputClass} pl-8 tabular-nums`}
                                  placeholder={t("investments.logModal.snapshot.movePlaceholder")}
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={form.snapshot.moveAmt}
                                  onChange={(e) => form.snapshot.setMoveAmt(e.target.value)}
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Dynamic Growth Preview */}
                      <AnimatePresence>
                        {form.snapshot.value && form.preview.prevValue > 0 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-between gap-3 px-3 h-11 rounded-lg bg-surface-container-low border border-outline-variant"
                          >
                            <span className="text-xs font-medium text-on-surface-variant">
                              {t("investments.logModal.snapshot.growthLabel")}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 h-6 px-2 rounded text-sm font-semibold tabular-nums ${form.preview.isPositive ? "bg-secondary/10 text-secondary" : "bg-error/10 text-error"}`}
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                {form.preview.isPositive ? "arrow_upward" : "arrow_downward"}
                              </span>
                              {form.preview.isPositive ? "+" : "-"}
                              {currency.symbol}
                              {Math.abs(form.preview.organicGrowth).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="shrink-0 flex justify-end gap-2 px-5 py-3 border-t border-outline-variant">
                      <button type="button" onClick={onClose} className={cancelButtonClass}>
                        {t("common.cancel")}
                      </button>
                      <button
                        type="submit"
                        disabled={form.isSubmitting || !form.snapshot.assetId || !form.snapshot.value}
                        className={primaryButtonClass}
                      >
                        {form.isSubmitting ? t("investments.logModal.snapshot.confirming") : t("investments.logModal.snapshot.confirmButton")}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
