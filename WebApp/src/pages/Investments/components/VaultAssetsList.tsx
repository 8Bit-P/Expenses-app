import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency } from "../../../utils/currency";
import type { AssetWithSnapshots } from "../../../types/investments";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useInvestments } from "../../../hooks/useInvestments";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";
import Panel from "../../../components/ui/Panel";

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
  const { t, i18n } = useTranslation();
  const { currency } = useUserPreferences();
  const { deleteAsset } = useInvestments();
  const [currentPage, setCurrentPage] = useState(1);

  const dateLocale = i18n.language === "es" ? es : enUS;

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

  const pagerButton =
    "w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors disabled:opacity-40 disabled:pointer-events-none";

  return (
    <Panel
      title={t("investments.assetList.title")}
      subtitle={t("investments.assetList.subtitle")}
      flush
      className="h-full"
      bodyClassName="flex flex-col"
      actions={
        <button
          onClick={() => onLogSnapshot()}
          className="h-9 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors inline-flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          {t("investments.assetList.addNew")}
        </button>
      }
    >
      <div className="flex-1 border-t border-outline-variant">
        {assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <span className="material-symbols-outlined text-[24px] text-outline">account_balance</span>
            <p className="text-sm font-medium text-on-surface">{t("investments.assetList.noAssets")}</p>
          </div>
        ) : (
          <ul className="divide-y divide-outline-variant">
            {paginatedAssets.map((asset) => {
              const latestSnapshot = asset.asset_snapshots[0];
              const currentValue = latestSnapshot ? Number(latestSnapshot.total_value) : 0;

              // Stale Data Calculation
              let isStale = false;
              let lastUpdatedStr = t("investments.assetList.neverUpdated");
              if (latestSnapshot) {
                const diff = differenceInDays(new Date(), new Date(latestSnapshot.date));
                if (diff > 30) isStale = true;
                lastUpdatedStr = formatDistanceToNow(new Date(latestSnapshot.date), { addSuffix: true, locale: dateLocale });
              } else {
                // If it literally has no snapshots yet, consider it stale so they update it
                isStale = true;
              }

              return (
                <li
                  key={asset.id}
                  onClick={() => onLogSnapshot(asset.id)}
                  className="group flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-surface-container-low transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">{TYPE_ICONS[asset.type] || TYPE_ICONS.other}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <h4 className="text-sm font-medium text-on-surface truncate">{asset.name}</h4>
                      {isStale && (
                        <span className="inline-flex items-center h-5 px-1.5 rounded text-[11px] font-medium bg-error/10 text-error shrink-0">
                          {t("investments.assetList.needsUpdate")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant capitalize mt-0.5 truncate">
                      {t(`investments.allocation.types.${asset.type}`)} · {t("investments.assetList.lastUpdated", { date: lastUpdatedStr })}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="sr-only">{t("investments.assetList.value")}</span>
                    <span className="text-sm font-medium tabular-nums text-on-surface">
                      {internalFormatCurrency(currentValue)}
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                      edit_square
                    </span>
                    <button
                      onClick={(e) => handleDelete(e, asset.id, asset.name)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-error/10 hover:text-error transition-colors"
                      title={t("investments.assetList.deleteTitle")}
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {assets.length > ITEMS_PER_PAGE && (
        <div className="px-5 py-3 border-t border-outline-variant flex items-center justify-between gap-4">
          <p className="text-xs text-on-surface-variant tabular-nums">
            {t("investments.assetList.pagination", { current: currentPage, total: totalPages })}
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={pagerButton}
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={pagerButton}
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title={t("investments.assetList.deleteConfirm.title")}
        description={t("investments.assetList.deleteConfirm.description")}
        itemName={deleteModal.name}
        isDeleting={deleteAsset.isPending}
      />
    </Panel>
  );
}
