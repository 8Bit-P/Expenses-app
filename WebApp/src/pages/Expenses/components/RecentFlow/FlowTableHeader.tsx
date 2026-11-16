import { useTranslation } from "react-i18next";
import { cn } from "../../../../utils/cn";
import { FLOW_GRID_COLS } from "../../constants";

export default function FlowTableHeader() {
  const { t } = useTranslation();

  const COLUMNS = [
    t("expenses.recentFlow.columns.description"),
    t("expenses.recentFlow.columns.category"),
    t("expenses.recentFlow.columns.amount"),
    "",
  ];

  return (
    <div
      className={cn(
        "hidden items-center h-9 px-5 bg-surface-container-low border-b border-outline-variant",
        FLOW_GRID_COLS,
      )}
    >
      {COLUMNS.map((h, i) => (
        <span key={i} className={cn("eyebrow truncate", i === 2 && "text-right")}>
          {h}
        </span>
      ))}
    </div>
  );
}
