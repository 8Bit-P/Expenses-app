import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Check, Plus, Settings, HelpCircle } from "lucide-react";
import { useReserves, type Reserve } from "../../../hooks/useReserves";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency } from "../../../utils/currency";
import Panel from "../../../components/ui/Panel";

import CreateReserveModal from "./CreateReserveModal";
import ManageReserveModal from "./ManageReserveModal";

import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

export default function DashboardReserves({ onHelpClick }: { onHelpClick?: () => void }) {
  const { t } = useTranslation();
  const { reserves, isLoading, fundReserve } = useReserves();
  const { currency } = useUserPreferences();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [managingReserve, setManagingReserve] = useState<Reserve | null>(null);

  // Filter for active reserves (the hook now handles status === 'active')
  const activeReserves = reserves.slice(0, 4);

  return (
    <Panel
      className="h-full"
      icon="shield"
      flush
      title={
        <>
          {t("dashboard.reserves.title")}
          {onHelpClick && (
            <span className="group relative inline-flex items-center justify-center">
              <button
                type="button"
                onClick={onHelpClick}
                aria-label={t("dashboard.reserves.tooltip")}
                className="w-5 h-5 flex items-center justify-center text-outline hover:text-on-surface transition-colors cursor-help"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 px-2.5 py-2 bg-surface-container-lowest text-on-surface text-xs font-normal leading-snug rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity pointer-events-none z-50 text-left border border-outline-variant">
                {t("dashboard.reserves.tooltip")}
              </span>
            </span>
          )}
        </>
      }
      actions={
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="w-8 h-8 rounded-lg text-on-surface-variant flex items-center justify-center hover:bg-surface-container hover:text-on-surface transition-colors"
          title={t("dashboard.reserves.create")}
          aria-label={t("dashboard.reserves.create")}
        >
          <Plus className="w-[18px] h-[18px]" />
        </button>
      }
    >
      <CreateReserveModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      <ManageReserveModal
        isOpen={!!managingReserve}
        onClose={() => setManagingReserve(null)}
        reserve={managingReserve}
      />

      <div className="flex-1 border-t border-outline-variant">
        {isLoading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse bg-surface-container rounded-lg" />
            ))}
          </div>
        ) : activeReserves.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-5 text-center">
            <Target className="w-5 h-5 text-outline mb-2" />
            <p className="text-sm text-on-surface-variant">{t("dashboard.reserves.allFunded")}</p>
          </div>
        ) : (
          <ul className="divide-y divide-outline-variant">
            {activeReserves.map((reserve) => (
              <ReserveItem 
                key={reserve.id} 
                reserve={reserve} 
                currencyCode={currency.code}
                onFund={(amount) => fundReserve.mutate({ 
                  reserveId: reserve.id, 
                  reserveName: reserve.name, 
                  categoryId: reserve.category_id,
                  amount 
                })}
                onManage={() => setManagingReserve(reserve)}
                t={t}
              />
            ))}
          </ul>
        )}
      </div>
    </Panel>
  );
}

function ReserveItem({ 
  reserve, 
  currencyCode, 
  onFund,
  onManage,
  t
}: { 
  reserve: Reserve; 
  currencyCode: string;
  onFund: (amount: number) => void;
  onManage: () => void;
  t: TFunction;
}) {
  const [isFunding, setIsFunding] = useState(false);
  const [fundAmount, setFundAmount] = useState("");

  const percent = Math.min(100, (reserve.current_amount / reserve.target_amount) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(fundAmount);
    if (!isNaN(amount) && amount > 0) {
      onFund(amount);
      setFundAmount("");
      setIsFunding(false);
    }
  };

  return (
    <li className="group px-5 py-3 hover:bg-surface-container-low transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-lg shrink-0">
          {reserve.icon || "💰"}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-on-surface truncate">{reserve.name}</p>

            <div className="flex items-center gap-1 shrink-0">
              <AnimatePresence mode="wait" initial={false}>
                {!isFunding ? (
                  <motion.div
                    key="actions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="flex items-center gap-0.5"
                  >
                    <button
                      type="button"
                      onClick={() => setIsFunding(true)}
                      className="h-7 px-2 rounded-md text-xs font-medium text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1"
                      title={t("dashboard.reserves.fund")}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {t("dashboard.reserves.fund")}
                    </button>

                    <button
                      type="button"
                      onClick={onManage}
                      className="w-7 h-7 flex items-center justify-center rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors desk:opacity-0 desk:group-hover:opacity-100 desk:focus-visible:opacity-100"
                      title={t("dashboard.reserves.manage")}
                      aria-label={t("dashboard.reserves.manage")}
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="fund-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    onSubmit={handleSubmit}
                    className="flex items-center h-7 rounded-md border border-on-surface bg-surface-container-lowest overflow-hidden"
                  >
                    <input
                      autoFocus
                      type="number"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      placeholder="0"
                      className="w-20 h-full bg-transparent border-none focus:ring-0 focus:outline-none outline-none text-xs font-medium tabular-nums text-on-surface px-2 placeholder:text-outline [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      onBlur={() => !fundAmount && setIsFunding(false)}
                    />
                    <button
                      type="submit"
                      aria-label={t("dashboard.reserves.fund")}
                      className="w-7 h-full bg-primary text-on-primary flex items-center justify-center hover:opacity-90 transition-opacity"
                    >
                      <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 mt-0.5">
            <p className="text-xs tabular-nums text-on-surface-variant truncate">
              {formatCurrency(reserve.current_amount, currencyCode)}
              <span className="mx-1 text-outline">/</span>
              {formatCurrency(reserve.target_amount, currencyCode)}
            </p>
            <span className="text-xs tabular-nums text-on-surface-variant shrink-0">{Number.isFinite(percent) ? Math.round(percent) : 0}%</span>
          </div>

          <div className="relative h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute top-0 left-0 h-full bg-primary rounded-full"
            />
          </div>
        </div>
      </div>
    </li>
  );
}
