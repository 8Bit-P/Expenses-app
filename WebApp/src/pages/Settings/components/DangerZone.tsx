import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "sonner";

interface DangerZoneProps {
  onDeleteClick: () => void;
}

export default function DangerZone({ onDeleteClick }: DangerZoneProps) {
  const { session } = useAuth();
  const [exporting, setExporting] = useState(false);

  const handleExportCSV = async () => {
    if (!session?.user?.id) return;
    setExporting(true);

    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("date, type, amount, description, category:categories(name)")
        .eq("user_id", session.user.id)
        .order("date", { ascending: false });

      if (error || !data) throw error;

      const header = ["Date", "Type", "Amount", "Description", "Category"].join(",");
      const rows = data.map((tx: any) => [
        tx.date,
        tx.type,
        tx.amount,
        `"${(tx.description ?? "").replace(/"/g, '""')}"`,
        `"${(tx.category?.name ?? "").replace(/"/g, '""')}"`,
      ].join(","));

      const csv = [header, ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Data exported", {
        description: "Your ledger is ready for external review.",
      });
    } catch (err) {
      toast.error("Export failed", {
        description: "Could not generate your vault report.",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mt-12 space-y-4">
      {/* Export Data */}
      <div className="p-6 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h5 className="font-extrabold font-headline text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">download</span>
            Export Your Data
          </h5>
          <p className="text-on-surface-variant text-sm font-medium mt-1">
            Download a CSV of all your transactions. Your data, always yours.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className="px-6 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-bold transition-all active:scale-95 shadow-sm whitespace-nowrap disabled:opacity-50 text-sm"
        >
          {exporting ? "Exporting…" : "Export CSV"}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="p-8 rounded-xl bg-error-container/20 border border-error/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h5 className="text-error font-extrabold font-headline">Danger Zone</h5>
          <p className="text-error/70 text-sm font-medium mt-1">
            Permanently delete your vault and all ethereal data.
          </p>
        </div>
        <button
          onClick={onDeleteClick}
          className="px-6 py-2.5 bg-error text-white rounded-xl font-bold hover:bg-error/90 transition-all active:scale-95 shadow-sm whitespace-nowrap"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
