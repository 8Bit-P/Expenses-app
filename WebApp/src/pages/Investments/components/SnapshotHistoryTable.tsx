import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { format, parseISO } from "date-fns";
import { es, enUS } from "date-fns/locale";
import type { AssetWithSnapshots, AssetSnapshot } from "../../../types/investments";
import { useInvestments } from "../../../hooks/useInvestments";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency } from "../../../utils/currency";
import DeleteConfirmModal from "../../../components/ui/DeleteConfirmModal";
import { useIsMobile } from "../../../hooks/useIsMobile";

interface SnapshotHistoryTableProps {
  assets: AssetWithSnapshots[];
  stealthMode: boolean;
}

export default function SnapshotHistoryTable({ assets, stealthMode }: SnapshotHistoryTableProps) {
  const { t, i18n } = useTranslation();
  const { deleteSnapshot } = useInvestments();
  const { currency } = useUserPreferences();
  const isMobile = useIsMobile(768);

  const dateLocale = i18n.language === "es" ? es : enUS;

  // Combine and sort all snapshots from all assets globally
  const allHistory = useMemo(() => {
    let history: (AssetSnapshot & { assetName: string; assetType: string })[] = [];

    assets.forEach((asset) => {
      asset.asset_snapshots.forEach((snap) => {
        history.push({
          ...snap,
          assetName: asset.name,
          assetType: asset.type,
        });
      });
    });

    // Sort globally by date (descending) then by creation date as tie-breaker
    return history.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) return dateB - dateA;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [assets]);

  // Delete Confirmation State
  const [snapshotToDelete, setSnapshotToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!snapshotToDelete) return;
    setIsDeleting(true);
    try {
      await deleteSnapshot.mutateAsync(snapshotToDelete.id);
    } catch (error) {
      // Handled by mutation onError
    } finally {
      setIsDeleting(false);
      setSnapshotToDelete(null);
    }
  };

  const internalFormatCurrency = (val: number) => {
    if (stealthMode) return "****";
    return formatCurrency(val, currency.code);
  };

  if (allHistory.length === 0) return null; // Don't show the table if there is no data

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden flex flex-col">
      <div className="p-6 sm:p-8 border-b border-outline-variant/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              history
            </span>
          </div>
          <div>
            <h2 className="text-xl font-black font-headline text-on-surface tracking-tight">{t("investments.history.title")}</h2>
            <p className="text-xs font-bold text-on-surface-variant/70 mt-1">
              {t("investments.history.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {isMobile ? (
        <div className="divide-y divide-outline-variant/10">
          {allHistory.map((snap) => {
            const isPositiveFlow = Number(snap.contribution) > 0;
            const isNegativeFlow = Number(snap.contribution) < 0;

            return (
              <div key={snap.id} className="p-5 flex flex-col gap-4 active:bg-surface-container-low transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant/50">
                      {format(parseISO(snap.date), "MMM d, yyyy", { locale: dateLocale })}
                    </p>
                    <h4 className="text-sm font-black text-on-surface mt-1">{snap.assetName}</h4>
                    <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider mt-0.5">
                      {t(`investments.allocation.types.${snap.assetType}`)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSnapshotToDelete({ id: snap.id, name: snap.assetName })}
                    disabled={isDeleting}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-error/10 text-error disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-outline-variant/5">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40 block mb-0.5">
                      {t("investments.history.netFlow")}
                    </span>
                    <span
                      className={`text-sm font-black ${isPositiveFlow ? "text-emerald-500" : isNegativeFlow ? "text-red-500" : "text-on-surface-variant"}`}
                    >
                      {isPositiveFlow ? "+" : ""}
                      {stealthMode
                        ? "****"
                        : snap.contribution
                          ? formatCurrency(Number(snap.contribution), currency.code)
                          : "-"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40 block mb-0.5">
                      {t("investments.history.portfolioValue")}
                    </span>
                    <span className="text-sm font-black text-on-surface font-headline">
                      {internalFormatCurrency(Number(snap.total_value))}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 sm:px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 whitespace-nowrap">
                  {t("investments.history.columns.date")}
                </th>
                <th className="px-6 sm:px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70">
                  {t("investments.history.columns.asset")}
                </th>
                <th className="px-6 sm:px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 whitespace-nowrap text-right">
                  {t("investments.history.columns.contribution")}
                </th>
                <th className="px-6 sm:px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 whitespace-nowrap text-right">
                  {t("investments.history.columns.value")}
                </th>
                <th className="px-6 sm:px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 whitespace-nowrap text-center">
                  {t("investments.history.columns.action")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {allHistory.map((snap) => {
                const isPositiveFlow = Number(snap.contribution) > 0;
                const isNegativeFlow = Number(snap.contribution) < 0;

                return (
                  <tr key={snap.id} className="hover:bg-surface-container-low/30 transition-colors group">
                    <td className="px-6 sm:px-8 py-4 whitespace-nowrap">
                      <p className="text-sm font-bold text-on-surface">{format(parseISO(snap.date), "MMM d, yyyy", { locale: dateLocale })}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 mt-1">
                        {format(new Date(snap.created_at), "h:mm a", { locale: dateLocale })}
                      </p>
                    </td>
                    <td className="px-6 sm:px-8 py-4">
                      <p className="text-sm font-bold text-on-surface">{snap.assetName}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 mt-1 uppercase">
                        {t(`investments.allocation.types.${snap.assetType}`)}
                      </p>
                    </td>
                    <td className="px-6 sm:px-8 py-4 whitespace-nowrap text-right">
                      <span
                        className={`text-sm font-black tracking-tight ${isPositiveFlow ? "text-emerald-500" : isNegativeFlow ? "text-red-500" : "text-on-surface-variant"}`}
                      >
                        {isPositiveFlow ? "+" : ""}
                        {stealthMode
                          ? "****"
                          : snap.contribution
                            ? formatCurrency(Number(snap.contribution), currency.code)
                            : "-"}
                      </span>
                    </td>
                    <td className="px-6 sm:px-8 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-black font-headline text-on-surface">
                        {internalFormatCurrency(Number(snap.total_value))}
                      </span>
                    </td>
                    <td className="px-6 sm:px-8 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => setSnapshotToDelete({ id: snap.id, name: snap.assetName })}
                        disabled={isDeleting}
                        className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-on-surface-variant/40 hover:text-error hover:bg-error/10 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                        title={t("investments.history.deleteTitle")}
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!snapshotToDelete}
        onClose={() => setSnapshotToDelete(null)}
        onConfirm={confirmDelete}
        title={t("investments.history.deleteConfirm.title")}
        message={t("investments.history.deleteConfirm.description")}
        itemName={snapshotToDelete ? t("investments.history.deleteConfirm.itemName", { name: snapshotToDelete.name }) : undefined}
        isExecuting={isDeleting}
      />
    </div>
  );
}
