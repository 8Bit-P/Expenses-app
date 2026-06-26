import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAccounts } from "../../../hooks/useAccounts";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency } from "../../../utils/currency";
import AccountModal from "./AccountModal";
import type { AccountWithBalance } from "../../../types/accounts";

export default function AccountsWidget() {
  const { t } = useTranslation();
  const { accounts, isLoading } = useAccounts();
  const { currency } = useUserPreferences();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountWithBalance | null>(null);

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-lg font-black font-headline flex items-center gap-2 text-on-surface">
            <span className="material-symbols-outlined text-[20px] text-primary">account_balance</span>
            {t("accounts.title")}
          </h2>
          {accounts.length > 0 && (
            <p className="text-[10px] text-on-surface-variant/60 font-medium mt-0.5 uppercase tracking-wider">
              {t("accounts.balance")}:{" "}
              <span
                className={`font-black ${totalBalance >= 0 ? "text-emerald-500" : "text-error"}`}
              >
                {totalBalance >= 0 ? "" : "-"}
                {formatCurrency(Math.abs(totalBalance), currency.code)}
              </span>
            </p>
          )}
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all active:scale-95"
          title={t("accounts.addAccount")}
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-3 min-h-0">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-surface-container-low rounded-xl" />
            ))}
          </div>
        ) : accounts.length === 0 ? (
          <EmptyState onAdd={() => setIsCreateOpen(true)} t={t} />
        ) : (
          <AnimatePresence initial={false}>
            {accounts.map((account, i) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
              >
                <AccountCard
                  account={account}
                  currencyCode={currency.code}
                  onEdit={() => setEditingAccount(account)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Modals */}
      <AccountModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <AccountModal
        isOpen={!!editingAccount}
        onClose={() => setEditingAccount(null)}
        account={editingAccount}
      />
    </div>
  );
}

/* ── Sub-components ── */

function EmptyState({ onAdd, t }: { onAdd: () => void; t: (k: string) => string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px] text-primary/60">account_balance</span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-surface-container-lowest border-2 border-primary/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-[14px] text-primary">add</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-black text-on-surface">{t("accounts.emptyState.title")}</p>
        <p className="text-xs text-on-surface-variant/60 font-medium mt-1 max-w-[200px]">
          {t("accounts.emptyState.subtitle")}
        </p>
      </div>
      <button
        onClick={onAdd}
        className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:opacity-90 active:scale-[0.97] transition-all shadow-md shadow-primary/20"
      >
        {t("accounts.emptyState.cta")}
      </button>
    </div>
  );
}

function AccountCard({
  account,
  currencyCode,
  onEdit,
}: {
  account: AccountWithBalance;
  currencyCode: string;
  onEdit: () => void;
}) {
  const isNegative = account.balance < 0;

  return (
    <button
      onClick={onEdit}
      className="group w-full flex items-center gap-3 p-3 rounded-xl border border-outline-variant/10 hover:border-outline-variant/30 hover:bg-surface-container/60 transition-all duration-200 text-left"
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-inner"
        style={{ background: `${account.color}20`, border: `1.5px solid ${account.color}40` }}
      >
        {account.icon || "🏦"}
      </div>

      {/* Name + subtle color bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: account.color }}
          />
          <p className="font-bold text-sm text-on-surface truncate">{account.name}</p>
        </div>
        <p
          className={`text-xs font-black mt-0.5 tabular-nums ${isNegative ? "text-error" : "text-emerald-500"}`}
        >
          {isNegative ? "-" : "+"}
          {formatCurrency(Math.abs(account.balance), currencyCode)}
        </p>
      </div>

      {/* Edit chevron */}
      <span className="material-symbols-outlined text-[16px] text-on-surface-variant/30 group-hover:text-on-surface-variant transition-colors shrink-0">
        edit
      </span>
    </button>
  );
}
