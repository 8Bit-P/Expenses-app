import { useState } from "react";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency } from "../../../utils/currency";
import type { AssetWithSnapshots } from "../../../types/investments";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import { useInvestments } from "../../../hooks/useInvestments";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";

interface VaultAssetsListProps {
  assets: AssetWithSnapshots[];
  stealthMode: boolean;
  onLogSnapshot: (assetId?: string) => void;
}

const TYPE_ICONS: Record<string, string> = {
  fund: "pie_chart",
  crypto: "currency_bitcoin",
  stock: "trending_up",
  real_estate: "real_estate_agent",
  cash: "payments",
  other: "category",
};

export default function VaultAssetsList({ assets, stealthMode, onLogSnapshot }: VaultAssetsListProps) {
  const { currency } = useUserPreferences();
  const { deleteAsset } = useInvestments();
  const [currentPage, setCurrentPage] = useState(1);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; name: string }>({
    isOpen: false,
    id: "",
    name: "",
  });
  const ITEMS_PER_PAGE = 5;

  const totalPages = Math.ceil(assets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAssets = assets.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 if searching or filtering reduces count
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const internalFormatCurrency = (val: number) => {
    if (stealthMode) return "****";
    return formatCurrency(val, currency.code);
  };

  const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, id, name });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAsset.mutateAsync(deleteModal.id);
      setDeleteModal({ isOpen: false, id: "", name: "" });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-sm border border-outline-variant/10 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
        <div>
          <h3 className="text-xl font-headline font-black text-on-surface">Your Vault Assets</h3>
          <p className="text-xs font-bold text-on-surface-variant mt-1">
            Keep your ledger accurate for precision tracking.
          </p>
        </div>
        <button
          onClick={() => onLogSnapshot()}
          className="text-primary text-xs font-black uppercase tracking-widest hover:opacity-80 transition-opacity bg-primary/10 px-4 py-2 rounded-xl"
        >
          Add New Asset
        </button>
      </div>

      <div className="flex-1 space-y-4">
        {assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant/40">
            <span className="material-symbols-outlined text-5xl mb-2">account_balance</span>
            <p className="text-sm font-bold">No assets found in your vault.</p>
          </div>
        ) : (
          paginatedAssets.map((asset) => {
            const latestSnapshot = asset.asset_snapshots[0];
            const currentValue = latestSnapshot ? Number(latestSnapshot.total_value) : 0;

            // Stale Data Calculation
            let isStale = false;
            let lastUpdatedStr = "Never";
            if (latestSnapshot) {
              const diff = differenceInDays(new Date(), new Date(latestSnapshot.date));
              if (diff > 30) isStale = true;
              lastUpdatedStr = formatDistanceToNow(new Date(latestSnapshot.date), { addSuffix: true });
            } else {
              // If it literally has no snapshots yet, consider it stale so they update it
              isStale = true;
            }

            return (
              <div
                key={asset.id}
                onClick={() => onLogSnapshot(asset.id)}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container hover:shadow-sm transition-all cursor-pointer group border border-transparent hover:border-outline-variant/20"
              >
                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-on-surface bg-surface-container-highest group-hover:scale-105 transition-transform ${isStale ? "ring-2 ring-error/50" : ""}`}
                  >
                    <span className="material-symbols-outlined">{TYPE_ICONS[asset.type] || TYPE_ICONS.other}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface tracking-tight flex items-center gap-2">
                      {asset.name}
                      {isStale && (
                        <span className="flex items-center text-[9px] font-black uppercase tracking-widest bg-error-container text-error px-1.5 py-0.5 rounded-md">
                          <div className="w-1.5 h-1.5 bg-error rounded-full mr-1 animate-pulse"></div>
                          Needs Update
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-on-surface-variant font-medium capitalize mt-0.5">
                      {asset.type.replace("_", " ")} • Last updated: {lastUpdatedStr}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t border-outline-variant/10 sm:border-t-0">
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant block mb-0.5">
                      Value
                    </span>
                    <span className="text-lg font-black text-on-surface font-headline">
                      {internalFormatCurrency(currentValue)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDelete(e, asset.id, asset.name)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-error/10 hover:text-error transition-all"
                      title="Delete Asset"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                    <span className="material-symbols-outlined text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all hidden sm:block">
                      edit_square
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {assets.length > ITEMS_PER_PAGE && (
        <div className="mt-6 sm:mt-8 pt-6 border-t border-outline-variant/10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
          <p className="text-xs font-bold text-on-surface-variant">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container hover:bg-surface-container-highest transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-outline-variant/10"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container hover:bg-surface-container-highest transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-outline-variant/10"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title="Purge Asset?"
        description="This action is irreversible. All historical snapshots, performance metrics, and contribution data for this asset will be permanently erased from your ledger."
        itemName={deleteModal.name}
        isDeleting={deleteAsset.isPending}
      />
    </div>
  );
}
