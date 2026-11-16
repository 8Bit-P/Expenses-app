import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAccounts } from "../../../hooks/useAccounts";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency } from "../../../utils/currency";
import AccountModal from "./AccountModal";
import Panel from "../../../components/ui/Panel";
import type { AccountWithBalance } from "../../../types/accounts";

export default function AccountsWidget() {
  const { t } = useTranslation();
  const { accounts, isLoading } = useAccounts();
  const { currency } = useUserPreferences();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountWithBalance | null>(null);

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <Panel
      flush
      title={t("accounts.title")}
      subtitle={
        accounts.length > 0 ? (
          <span className="tabular-nums">
            {t("accounts.balance")}:{" "}
            <span className={`font-medium ${totalBalance >= 0 ? "text-on-surface" : "text-error"}`}>
              {totalBalance >= 0 ? "" : "−"}
              {formatCurrency(Math.abs(totalBalance), currency.code)}
            </span>
          </span>
        ) : undefined
      }
      actions={
        <button
          onClick={() => setIsCreateOpen(true)}
          className="w-8 h-8 rounded-lg border border-outline-variant text-on-surface-variant flex items-center justify-center hover:bg-surface-container hover:text-on-surface transition-colors"
          title={t("accounts.addAccount")}
          aria-label={t("accounts.addAccount")}
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
        </button>
      }
    >
      {isLoading ? (
        <div className="px-5 pb-5 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-11 bg-surface-container rounded-lg animate-pulse" />
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <EmptyState onAdd={() => setIsCreateOpen(true)} t={t} />
      ) : (
        <div className="divide-y divide-outline-variant border-t border-outline-variant">
          <AnimatePresence initial={false}>
            {accounts.map((account, i) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, delay: i * 0.03 }}
              >
                <AccountRow account={account} currencyCode={currency.code} onEdit={() => setEditingAccount(account)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      <AccountModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <AccountModal isOpen={!!editingAccount} onClose={() => setEditingAccount(null)} account={editingAccount} />
    </Panel>
  );
}

/* Sub-components */

function EmptyState({ onAdd, t }: { onAdd: () => void; t: (k: string) => string }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 px-5 pb-8 pt-4">
      <span className="material-symbols-outlined text-[28px] text-outline">account_balance</span>
      <div>
        <p className="text-sm font-medium text-on-surface">{t("accounts.emptyState.title")}</p>
        <p className="text-xs text-on-surface-variant mt-1 max-w-[240px]">{t("accounts.emptyState.subtitle")}</p>
      </div>
      <button
        onClick={onAdd}
        className="h-8 px-3 rounded-lg bg-primary text-on-primary text-xs font-medium hover:opacity-90 active:scale-[0.98] transition"
      >
        {t("accounts.emptyState.cta")}
      </button>
    </div>
  );
}

function AccountRow({
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
      className="group w-full flex items-center gap-3 px-5 h-14 hover:bg-surface-container-low transition-colors text-left"
    >
      <span className="relative w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 bg-surface-container">
        {account.icon || "🏦"}
        <span
          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-surface-container-lowest"
          style={{ background: account.color }}
        />
      </span>
      <p className="flex-1 min-w-0 text-[13px] font-medium text-on-surface truncate">{account.name}</p>
      <p className={`text-[13px] font-medium tabular-nums shrink-0 ${isNegative ? "text-error" : "text-on-surface"}`}>
        {isNegative ? "−" : ""}
        {formatCurrency(Math.abs(account.balance), currencyCode)}
      </p>
      <span className="material-symbols-outlined text-[16px] text-outline opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        edit
      </span>
    </button>
  );
}
