import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "sonner";
import Panel from "../../../components/ui/Panel";
import SettingsGroup from "./SettingsGroup";

interface ExportRow {
  date: string;
  type: string;
  amount: number;
  description: string | null;
  category: { name: string } | null;
}

interface DangerZoneProps {
  onDeleteClick: () => void;
}

export function ExportData() {
  const { t } = useTranslation();
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
      const rows = (data as unknown as ExportRow[]).map((tx) => [
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
      toast.success(t("settings.danger.exportSuccess"), {
        description: t("settings.danger.exportSuccessDesc"),
      });
    } catch {
      toast.error(t("settings.danger.exportFailed"), {
        description: t("settings.danger.exportFailedDesc"),
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <SettingsGroup title={t("settings.danger.exportTitle")} description={t("settings.danger.exportDesc")}>
      <Panel>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">table_view</span>
            </div>
            <p className="text-[13px] text-on-surface-variant font-mono truncate">
              transactions-{new Date().toISOString().split("T")[0]}.csv
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="h-9 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[18px] ${exporting ? "animate-spin" : ""}`}>
              {exporting ? "progress_activity" : "download"}
            </span>
            {exporting ? t("settings.danger.exporting") : t("settings.danger.exportButton")}
          </button>
        </div>
      </Panel>
    </SettingsGroup>
  );
}

export default function AccountDeletion({ onDeleteClick }: DangerZoneProps) {
  const { t } = useTranslation();
  return (
    <SettingsGroup
      title={t("settings.danger.zoneTitle")}
      description={t("settings.danger.zoneDesc")}
      titleClassName="text-error"
    >
      <div className="rounded-2xl border border-error/40 bg-surface-container-lowest p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <span className="material-symbols-outlined text-[20px] text-error mt-px">warning</span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-on-surface">{t("settings.danger.deleteButton")}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">{t("settings.danger.modal.desc")}</p>
          </div>
        </div>
        <button
          onClick={onDeleteClick}
          className="h-9 px-3.5 rounded-lg border border-error/40 text-error text-sm font-medium hover:bg-error hover:text-white hover:border-error transition-colors whitespace-nowrap shrink-0"
        >
          {t("settings.danger.deleteButton")}
        </button>
      </div>
    </SettingsGroup>
  );
}
