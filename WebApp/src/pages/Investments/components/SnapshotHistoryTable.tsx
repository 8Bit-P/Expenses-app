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
import Panel from "../../../components/ui/Panel";
import { cn } from "../../../utils/cn";

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
    const history: (AssetSnapshot & { assetName: string; assetType: string })[] = [];

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
    } catch {
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

  const flowClass = (contribution: number) =>
    contribution > 0 ? "text-secondary" : contribution < 0 ? "text-error" : "text-on-surface-variant";

  const formatFlow = (contribution: AssetSnapshot["contribution"]) => (
    <>
      {Number(contribution) > 0 ? "+" : ""}
      {stealthMode ? "****" : contribution ? formatCurrency(Number(contribution), currency.code) : "-"}
    </>
  );

  if (allHistory.length === 0) return null; // Don't show the table if there is no data

  return (
    <Panel title={t("investments.history.title")} subtitle={t("investments.history.subtitle")} flush>
      {isMobile ? (
        <ul className="divide-y divide-outline-variant border-t border-outline-variant">
          {allHistory.map((snap) => (
            <li key={snap.id} className="flex items-center gap-3 px-5 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-on-surface truncate">{snap.assetName}</p>
                <p className="text-xs text-on-surface-variant mt-0.5 truncate">
                  {format(parseISO(snap.date), "MMM d, yyyy", { locale: dateLocale })} ·{" "}
                  {t(`investments.allocation.types.${snap.assetType}`)}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium tabular-nums text-on-surface">
                  <span className="sr-only">{t("investments.history.portfolioValue")}: </span>
                  {internalFormatCurrency(Number(snap.total_value))}
                </p>
                <p className={cn("text-xs font-medium tabular-nums mt-0.5", flowClass(Number(snap.contribution)))}>
                  <span className="sr-only">{t("investments.history.netFlow")}: </span>
                  {formatFlow(snap.contribution)}
                </p>
              </div>
              <button
                onClick={() => setSnapshotToDelete({ id: snap.id, name: snap.assetName })}
                disabled={isDeleting}
                className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-error/10 hover:text-error transition-colors disabled:opacity-40"
                title={t("investments.history.deleteTitle")}
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-y border-outline-variant">
                <th className="eyebrow px-5 h-9 whitespace-nowrap">{t("investments.history.columns.date")}</th>
                <th className="eyebrow px-5 h-9">{t("investments.history.columns.asset")}</th>
                <th className="eyebrow px-5 h-9 whitespace-nowrap text-right">
                  {t("investments.history.columns.contribution")}
                </th>
                <th className="eyebrow px-5 h-9 whitespace-nowrap text-right">{t("investments.history.columns.value")}</th>
                <th className="eyebrow px-5 h-9 whitespace-nowrap text-right w-20">
                  {t("investments.history.columns.action")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {allHistory.map((snap) => (
                <tr key={snap.id} className="h-12 hover:bg-surface-container-low transition-colors group">
                  <td className="px-5 whitespace-nowrap">
                    <span className="text-sm text-on-surface tabular-nums">
                      {format(parseISO(snap.date), "MMM d, yyyy", { locale: dateLocale })}
                    </span>
                    <span className="ml-2 text-xs text-outline tabular-nums">
                      {format(new Date(snap.created_at), "h:mm a", { locale: dateLocale })}
                    </span>
                  </td>
                  <td className="px-5">
                    <span className="text-sm font-medium text-on-surface">{snap.assetName}</span>
                    <span className="ml-2 text-xs text-on-surface-variant">
                      {t(`investments.allocation.types.${snap.assetType}`)}
                    </span>
                  </td>
                  <td
                    className={cn(
                      "px-5 whitespace-nowrap text-right text-sm font-medium tabular-nums",
                      flowClass(Number(snap.contribution)),
                    )}
                  >
                    {formatFlow(snap.contribution)}
                  </td>
                  <td className="px-5 whitespace-nowrap text-right text-sm font-medium tabular-nums text-on-surface">
                    {internalFormatCurrency(Number(snap.total_value))}
                  </td>
                  <td className="px-5 whitespace-nowrap text-right">
                    <button
                      onClick={() => setSnapshotToDelete({ id: snap.id, name: snap.assetName })}
                      disabled={isDeleting}
                      className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100 disabled:opacity-40"
                      title={t("investments.history.deleteTitle")}
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
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
    </Panel>
  );
}
