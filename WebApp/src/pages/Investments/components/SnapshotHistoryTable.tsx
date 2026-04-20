import { useState, useMemo } from "react";
import { format, parseISO } from "date-fns";
import type { AssetWithSnapshots, AssetSnapshot } from "../../../types/investments";
import { useInvestments } from "../../../hooks/useInvestments";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import DeleteConfirmModal from "../../../components/ui/DeleteConfirmModal";

interface SnapshotHistoryTableProps {
  assets: AssetWithSnapshots[];
  stealthMode: boolean;
}

export default function SnapshotHistoryTable({ assets, stealthMode }: SnapshotHistoryTableProps) {
  const { deleteSnapshot } = useInvestments();
  const { currency } = useUserPreferences();

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

  const formatCurrency = (val: number) => {
    if (stealthMode) return "****";
    return `${currency.symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (allHistory.length === 0) return null; // Don't show the table if there is no data

  return (
    <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/10 overflow-hidden flex flex-col">
      <div className="p-6 sm:p-8 border-b border-outline-variant/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              history
            </span>
          </div>
          <div>
            <h2 className="text-xl font-black font-headline text-on-surface tracking-tight">Ledger History</h2>
            <p className="text-xs font-bold text-on-surface-variant/70 mt-1">
              A complete chronological record of all your asset snapshots and cash flows.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 whitespace-nowrap">
                Date
              </th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70">
                Asset
              </th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 whitespace-nowrap text-right">
                Net Contribution
              </th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 whitespace-nowrap text-right">
                Total Value
              </th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 whitespace-nowrap text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5">
            {allHistory.map((snap) => {
              const isPositiveFlow = Number(snap.contribution) > 0;
              const isNegativeFlow = Number(snap.contribution) < 0;

              return (
                <tr key={snap.id} className="hover:bg-surface-container-low/30 transition-colors group">
                  {/* Date */}
                  <td className="px-8 py-4 whitespace-nowrap">
                    <p className="text-sm font-bold text-on-surface">{format(parseISO(snap.date), "MMM d, yyyy")}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 mt-1">
                      {format(new Date(snap.created_at), "h:mm a")}
                    </p>
                  </td>

                  {/* Asset */}
                  <td className="px-8 py-4">
                    <p className="text-sm font-bold text-on-surface">{snap.assetName}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 mt-1 capitalize">
                      {snap.assetType.replace("_", " ")}
                    </p>
                  </td>

                  {/* Net Contribution */}
                  <td className="px-8 py-4 whitespace-nowrap text-right">
                    <span
                      className={`text-sm font-black tracking-tight ${isPositiveFlow ? "text-emerald-500" : isNegativeFlow ? "text-red-500" : "text-on-surface-variant"}`}
                    >
                      {isPositiveFlow ? "+" : ""}
                      {stealthMode
                        ? "****"
                        : snap.contribution
                          ? `${currency.symbol}${Number(snap.contribution).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : "-"}
                    </span>
                  </td>

                  {/* Total Value */}
                  <td className="px-6 sm:px-8 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-black font-headline text-on-surface">
                      {formatCurrency(Number(snap.total_value))}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 sm:px-8 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => setSnapshotToDelete({ id: snap.id, name: snap.assetName })}
                      disabled={isDeleting}
                      className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-on-surface-variant/40 hover:text-error hover:bg-error/10 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                      title="Delete Snapshot"
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                      >
                        delete
                      </span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <DeleteConfirmModal
        isOpen={!!snapshotToDelete}
        onClose={() => setSnapshotToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Timeline Entry"
        message="This will permanently delete this snapshot. Your asset's total value and ROI metrics will recalculate immediately to reflect this change."
        itemName={snapshotToDelete ? `${snapshotToDelete.name} Snapshot` : undefined}
        isExecuting={isDeleting}
      />
    </div>
  );
}
