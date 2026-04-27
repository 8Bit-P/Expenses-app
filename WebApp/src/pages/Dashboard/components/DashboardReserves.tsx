import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Check, Shield, Plus, Settings } from "lucide-react";
import { useReserves, type Reserve } from "../../../hooks/useReserves";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency } from "../../../utils/currency";

import CreateReserveModal from "./CreateReserveModal";
import ManageReserveModal from "./ManageReserveModal";

import { useTranslation } from "react-i18next";

export default function DashboardReserves() {
  const { t } = useTranslation();
  const { reserves, isLoading, fundReserve } = useReserves();
  const { currency } = useUserPreferences();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [managingReserve, setManagingReserve] = useState<Reserve | null>(null);

  // Filter for active reserves (the hook now handles status === 'active')
  const activeReserves = reserves.slice(0, 4);

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-black font-headline flex items-center gap-2 text-on-surface">
          <Shield className="w-5 h-5 text-primary" />
          {t("dashboard.reserves.title")}
        </h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all active:scale-95"
          title={t("dashboard.reserves.create")}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <CreateReserveModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      <ManageReserveModal
        isOpen={!!managingReserve}
        onClose={() => setManagingReserve(null)}
        reserve={managingReserve}
      />

      <div className="space-y-5 flex-1">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-surface-container-low rounded-xl" />
            ))}
          </div>
        ) : activeReserves.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center mb-3">
              <Target className="w-6 h-6 text-on-surface-variant/20" />
            </div>
            <p className="text-xs font-bold text-on-surface-variant">{t("dashboard.reserves.allFunded")}</p>
          </div>
        ) : (
          activeReserves.map((reserve) => (
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
          ))
        )}
      </div>
    </div>
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
  t: any;
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
    <div className="group relative">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center text-lg shadow-inner border border-outline-variant/5">
            {reserve.icon || "💰"}
          </div>
          <div>
            <p className="font-bold text-xs text-on-surface leading-none mb-1.5">{reserve.name}</p>
            <p className="text-[10px] tabular-nums font-medium text-on-surface-variant/70">
              {formatCurrency(reserve.current_amount, currencyCode)} 
              <span className="mx-1 opacity-30">/</span>
              {formatCurrency(reserve.target_amount, currencyCode)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <AnimatePresence mode="wait">
            {!isFunding ? (
              <motion.div
                key="actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1"
              >
                <button
                  onClick={() => setIsFunding(true)}
                  className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  title={t("dashboard.reserves.fund")}
                >
                  <Plus className="w-3 h-3" />
                  {t("dashboard.reserves.fund")}
                </button>
                
                <button
                  onClick={onManage}
                  className="p-1.5 text-on-surface-variant/30 hover:text-on-surface hover:bg-surface-container rounded-lg opacity-0 group-hover:opacity-100 transition-all ml-1"
                  title={t("dashboard.reserves.manage")}
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="fund-form"
                initial={{ opacity: 0, width: 40 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 40 }}
                onSubmit={handleSubmit}
                className="flex items-center gap-1 bg-surface-container rounded-lg p-0.5 border border-primary/20"
              >
                <input
                  autoFocus
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="0"
                  className="w-20 bg-transparent border-none focus:ring-0 focus:outline-none outline-none text-[11px] font-black text-on-surface pl-2 placeholder:text-on-surface-variant/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  onBlur={() => !fundAmount && setIsFunding(false)}
                />
                <button
                  type="submit"
                  className="w-6 h-6 bg-primary text-on-primary rounded-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                >
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_8px_rgba(53,37,205,0.4)] rounded-full"
        />
      </div>
    </div>
  );
}
