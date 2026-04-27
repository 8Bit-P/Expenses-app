import { useTranslation } from "react-i18next";

export default function FlowTableHeader() {
  const { t } = useTranslation();

  const COLUMNS = [
    t("expenses.recentFlow.columns.description"),
    t("expenses.recentFlow.columns.category"),
    t("expenses.recentFlow.columns.amount"),
    "",
  ];

  return (
    <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_80px] gap-4 px-4 md:px-6 py-1.5 border-b border-outline-variant/10">
      {COLUMNS.map((h, i) => (
        <span key={i} className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">
          {h}
        </span>
      ))}
    </div>
  );
}
