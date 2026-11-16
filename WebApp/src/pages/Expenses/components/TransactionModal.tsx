import { useState, useEffect } from "react";
import { useCategories } from "../../../hooks/useCategories";
import { useTransactions } from "../../../hooks/useTransactions";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { useAccounts } from "../../../hooks/useAccounts";
import { CustomSelect } from "../../../components/ui/CustomSelect";
import type { Category, TransactionType } from "../../../types/expenses";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { toast } from "sonner";
import VaultConfirmationModal from "../../../components/ui/VaultConfirmationModal";
import { useTransactionForm } from "../../../hooks/useTransactionForm";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: any;
}

export default function TransactionModal({ isOpen, onClose, transaction }: TransactionModalProps) {
  const { t } = useTranslation();
  const { categories, addCategory } = useCategories();
  const { deleteTransaction } = useTransactions();
  const { currency, resolvedTheme } = useUserPreferences();
  const { handleSave: saveTransaction, isSubmitting: isSaving } = useTransactionForm(transaction);
  const { accounts } = useAccounts();

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [needsReview, setNeedsReview] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryEmoji, setNewCategoryEmoji] = useState("📦");
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (transaction) {
        setType(transaction.type);
        setAmount(transaction.amount.toString());
        setDescription(transaction.description || transaction.name || "");
        setCategoryId(transaction.category_id || transaction.category?.id || "");
        setAccountId(transaction.account_id || "");
        setDate(transaction.date || new Date().toISOString().split("T")[0]);
        setNeedsReview(!!transaction.needs_review);
      } else {
        setType("expense");
        setAmount("");
        setDescription("");
        setAccountId("");
        setDate(new Date().toISOString().split("T")[0]);
        setNeedsReview(false);
      }
      setIsCreatingCategory(false);
      setNewCategoryName("");
      setNewCategoryEmoji("📦");
      setCategoryError(null);
      setShowEmojiPicker(false);
    }
  }, [transaction, isOpen]);

  // Set default category only if it's empty and we have categories available
  useEffect(() => {
    if (isOpen && !transaction && !categoryId && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [isOpen, transaction, categoryId, categories]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const isEditing = !!transaction;

  const handleSave = async () => {
    await saveTransaction(
      {
        type,
        amount,
        description,
        categoryId,
        accountId,
        date,
        needsReview,
      },
      onClose,
    );
  };

  const handleDelete = async () => {
    if (!transaction?.id) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(transaction.id);
      toast.success(t("expenses.transactionModal.toasts.deleted"));
      onClose();
    } catch (err: any) {
      toast.error(t("expenses.transactionModal.toasts.deleteFailed"), {
        description: err.message || t("expenses.transactionModal.toasts.deleteFailedDefault"),
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const labelCls = "eyebrow block mb-1.5";
  const inputCls =
    "w-full h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface placeholder:text-outline focus:border-on-surface focus:ring-0 focus:outline-none transition-colors";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            className="relative bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl border border-outline-variant max-h-[90dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-outline-variant">
              <div className="min-w-0">
                <h2 className="text-[17px] font-semibold text-on-surface leading-6">
                  {isEditing ? t("expenses.transactionModal.titles.edit") : t("expenses.transactionModal.titles.new")}
                </h2>
                <p className="text-sm text-on-surface-variant mt-0.5">
                  {isEditing
                    ? t("expenses.transactionModal.descriptions.edit")
                    : t("expenses.transactionModal.descriptions.new")}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 -mr-2 shrink-0 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5">
              {/* Type Toggle */}
              <div className="grid grid-cols-2 p-0.5 rounded-lg bg-surface-container border border-outline-variant">
                <button
                  onClick={() => setType("expense")}
                  className={`h-9 flex items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    type === "expense"
                      ? "bg-surface-container-lowest text-error shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                  <span className="truncate">{t("expenses.transactionModal.types.expense")}</span>
                </button>
                <button
                  onClick={() => setType("income")}
                  className={`h-9 flex items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    type === "income"
                      ? "bg-surface-container-lowest text-secondary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                  <span className="truncate">{t("expenses.transactionModal.types.income")}</span>
                </button>
              </div>

              {/* Amount */}
              <div>
                <label className={labelCls}>{t("expenses.transactionModal.labels.amount")}</label>
                <div className="flex items-center h-16 px-4 rounded-xl border border-outline-variant bg-surface-container-lowest focus-within:border-on-surface transition-colors">
                  <span className="text-2xl font-medium text-on-surface-variant mr-2 select-none">
                    {currency.symbol}
                  </span>
                  <input
                    autoFocus
                    className={`w-full bg-transparent border-none text-3xl font-semibold tracking-tight tabular-nums placeholder:text-outline-variant outline-none p-0 focus:ring-0 ${
                      type === "income" ? "text-secondary" : "text-on-surface"
                    }`}
                    type="number"
                    step="0.01"
                    placeholder={t("expenses.transactionModal.placeholders.amount")}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              {/* Category Selector */}
              <div className="relative z-[60]">
                <label className={labelCls}>{t("expenses.transactionModal.labels.category")}</label>

                {isCreatingCategory ? (
                  <div className="space-y-2">
                    <div className="relative flex items-center h-10 rounded-lg border border-outline-variant bg-surface-container-lowest focus-within:border-on-surface transition-colors">
                      <div className="relative flex items-center h-full">
                        <button
                          type="button"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="w-10 h-full flex items-center justify-center text-lg rounded-l-lg hover:bg-surface-container-low transition-colors select-none"
                        >
                          {newCategoryEmoji}
                        </button>

                        {showEmojiPicker && (
                          <div className="absolute top-[110%] left-0 z-[60] shadow-2xl rounded-lg border border-outline-variant overflow-hidden">
                            <EmojiPicker
                              emojiStyle={EmojiStyle.NATIVE}
                              onEmojiClick={(e) => {
                                setNewCategoryEmoji(e.emoji);
                                setShowEmojiPicker(false);
                              }}
                              skinTonesDisabled
                              theme={resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT}
                              width={window.innerWidth < 400 ? 280 : 320}
                              height={350}
                            />
                          </div>
                        )}
                      </div>
                      <div className="w-px h-5 bg-outline-variant" />
                      <input
                        type="text"
                        className="w-full h-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm text-on-surface placeholder:text-outline px-3"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder={t("expenses.transactionModal.createCategory.placeholder")}
                        autoFocus
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setIsCreatingCategory(false);
                          setNewCategoryName("");
                          setCategoryError(null);
                        }}
                        className="h-9 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors"
                      >
                        {t("common.cancel") || "Cancel"}
                      </button>
                      <button
                        onClick={async () => {
                          if (!newCategoryName) {
                            setCategoryError(t("expenses.transactionModal.createCategory.error.nameRequired"));
                            return;
                          }
                          setCategoryError(null);
                          try {
                            const newCat = await addCategory({ name: newCategoryName, emoji: newCategoryEmoji });
                            toast.success(t("expenses.transactionModal.createCategory.toast.success"), {
                              description: t("expenses.transactionModal.createCategory.toast.successDesc", {
                                emoji: newCategoryEmoji,
                                name: newCategoryName,
                              }),
                            });
                            setCategoryId(newCat.id);
                            setIsCreatingCategory(false);
                            setNewCategoryName("");
                            setNewCategoryEmoji("📦");
                          } catch (e: any) {
                            toast.error(t("expenses.transactionModal.createCategory.toast.error"), {
                              description:
                                e.message || t("expenses.transactionModal.createCategory.toast.errorDefault"),
                            });
                            setCategoryError(
                              e.message || t("expenses.transactionModal.createCategory.toast.errorDefault"),
                            );
                          }
                        }}
                        disabled={isSaving}
                        title={t("expenses.transactionModal.createCategory.title")}
                        className="h-9 w-12 rounded-lg bg-primary text-on-primary text-sm font-medium hover:opacity-90 active:scale-[0.98] transition flex items-center justify-center disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </button>
                    </div>
                    {categoryError && (
                      <p className="text-xs text-error flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        {categoryError}
                      </p>
                    )}
                  </div>
                ) : (
                  <CustomSelect
                    value={categoryId}
                    options={[
                      ...(categoryId === ""
                        ? [{ value: "", label: t("expenses.transactionModal.placeholders.category") }]
                        : []),
                      ...categories.map((cat: Category) => ({
                        value: cat.id,
                        label: `${cat.emoji ?? ""} ${cat.name}`,
                      })),
                    ]}
                    onChange={setCategoryId}
                    className="w-full"
                    onAddAction={() => setIsCreatingCategory(true)}
                    addActionLabel={t("expenses.transactionModal.createCategory.title")}
                  />
                )}
              </div>

              {/* Account Selector — only shown when user has accounts */}
              {accounts.length > 0 && (
                <div className="relative z-50">
                  <label className={labelCls}>{t("accounts.transactionField.label")}</label>
                  <CustomSelect
                    value={accountId}
                    options={[
                      { value: "", label: t("accounts.transactionField.placeholder") },
                      ...accounts.map((acc) => ({
                        value: acc.id,
                        label: `${acc.icon || "🏦"} ${acc.name}`,
                      })),
                    ]}
                    onChange={setAccountId}
                    className="w-full"
                  />
                </div>
              )}

              {/* Date & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-[180px_minmax(0,1fr)] gap-4 relative z-40">
                <div>
                  <label className={labelCls}>{t("expenses.transactionModal.labels.date")}</label>
                  <input
                    type="date"
                    className={`${inputCls} tabular-nums [&::-webkit-calendar-picker-indicator]:opacity-60`}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelCls}>{t("expenses.transactionModal.labels.description")}</label>
                  <input
                    className={inputCls}
                    placeholder={t("expenses.transactionModal.placeholders.description")}
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              {/* Review Toggle */}
              <div className="flex items-center justify-between gap-4 p-3 rounded-lg border border-outline-variant">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      needsReview ? "bg-tertiary/10 text-tertiary" : "bg-surface-container text-on-surface-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">inbox</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-on-surface">{t("expenses.transactionModal.review.label")}</p>
                    <p className="text-xs text-on-surface-variant">{t("expenses.transactionModal.review.desc")}</p>
                  </div>
                </div>
                <button
                  role="switch"
                  aria-checked={needsReview}
                  onClick={() => setNeedsReview(!needsReview)}
                  className={`relative w-10 h-6 shrink-0 rounded-full transition-colors duration-200 outline-none ${
                    needsReview ? "bg-primary" : "bg-surface-container-highest"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      needsReview ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-outline-variant flex items-center gap-2">
              {isEditing && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isSaving || isDeleting}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-error/30 text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                  title={t("expenses.transactionModal.actions.delete")}
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              )}

              <div className="flex-1" />

              <button
                onClick={onClose}
                className="h-9 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors disabled:opacity-50"
                disabled={isSaving || isDeleting}
              >
                {t("common.cancel")}
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving || isDeleting || !amount}
                className="h-9 px-4 rounded-lg bg-primary text-on-primary text-sm font-medium hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50 disabled:active:scale-100 truncate"
              >
                {isSaving
                  ? t("expenses.transactionModal.actions.saving")
                  : isEditing
                    ? t("expenses.transactionModal.actions.save")
                    : t("expenses.transactionModal.actions.confirm")}
              </button>
            </div>
          </motion.div>
          <VaultConfirmationModal
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={handleDelete}
            title={t("expenses.transactionModal.deleteConfirm.title")}
            description={t("expenses.transactionModal.deleteConfirm.description")}
            confirmLabel={t("expenses.transactionModal.deleteConfirm.confirm")}
            cancelLabel={t("expenses.transactionModal.deleteConfirm.cancel")}
            isLoading={isDeleting}
            variant="danger"
          />
        </div>
      )}
    </AnimatePresence>
  );
}
