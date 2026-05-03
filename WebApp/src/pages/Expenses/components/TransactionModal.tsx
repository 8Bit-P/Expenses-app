import { useState, useEffect } from "react";
import { useCategories } from "../../../hooks/useCategories";
import { useTransactions } from "../../../hooks/useTransactions";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { useReserves } from "../../../hooks/useReserves";
import { CustomSelect } from "../../../components/ui/CustomSelect";
import type { Category, TransactionType } from "../../../types/expenses";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
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
  const { currency } = useUserPreferences();
  const { reserves } = useReserves();

  const { handleSave: saveTransaction, isSubmitting: isSaving } = useTransactionForm(transaction);

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [reserveId, setReserveId] = useState("");
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
        setReserveId(transaction.reserve_id || "");
        setDate(transaction.date || new Date().toISOString().split("T")[0]);
        setNeedsReview(!!transaction.needs_review);
      } else {
        setType("expense");
        setAmount("");
        setDescription("");
        setCategoryId(categories[0]?.id || "");
        setReserveId("");
        setDate(new Date().toISOString().split("T")[0]);
        setNeedsReview(false);
      }
      setIsCreatingCategory(false);
      setNewCategoryName("");
      setNewCategoryEmoji("📦");
      setCategoryError(null);
      setShowEmojiPicker(false);
    }
  }, [transaction, isOpen, categories]);

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
        reserveId,
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative bg-surface-container-lowest/95 backdrop-blur-xl w-full max-w-xl rounded-2xl shadow-2xl border border-outline-variant/20 ring-1 ring-black/5 overflow-visible"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-8 pt-8 pb-6 border-b border-outline-variant/5">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-2xl font-black text-on-surface tracking-tight font-headline">
                  {isEditing ? t("expenses.transactionModal.titles.edit") : t("expenses.transactionModal.titles.new")}
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
              <p className="text-on-surface-variant/80 text-sm font-medium">
                {isEditing
                  ? t("expenses.transactionModal.descriptions.edit")
                  : t("expenses.transactionModal.descriptions.new")}
              </p>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
              {/* Type Toggle */}
              <div className="flex bg-surface-container-low p-1 rounded-lg sm:rounded-xl gap-1 border border-outline-variant/5">
                <button
                  onClick={() => setType("expense")}
                  disabled={isEditing && transaction?.reserve_id}
                  className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-4 rounded-md sm:rounded-lg font-black text-[9px] sm:text-xs uppercase tracking-widest transition-all duration-300 disabled:opacity-50 whitespace-nowrap ${
                    type === "expense"
                      ? "bg-error text-on-error shadow-md shadow-error/20 scale-[1.02]"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px]">arrow_circle_down</span>
                  <span className="truncate">{t("expenses.transactionModal.types.expense")}</span>
                </button>
                <button
                  onClick={() => setType("transfer")}
                  className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-4 rounded-md sm:rounded-lg font-black text-[9px] sm:text-xs uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                    type === "transfer"
                      ? "bg-primary text-on-primary shadow-md shadow-primary/20 scale-[1.02]"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px]">swap_horiz</span>
                  <span className="truncate">{t("expenses.transactionModal.types.transfer")}</span>
                </button>
                <button
                  onClick={() => setType("income")}
                  disabled={isEditing && transaction?.reserve_id}
                  className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-4 rounded-md sm:rounded-lg font-black text-[9px] sm:text-xs uppercase tracking-widest transition-all duration-300 disabled:opacity-50 whitespace-nowrap ${
                    type === "income"
                      ? "bg-secondary text-on-secondary shadow-md shadow-secondary/20 scale-[1.02]"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px]">arrow_circle_up</span>
                  <span className="truncate">{t("expenses.transactionModal.types.income")}</span>
                </button>
              </div>

              {/* Amount Input (Hero Section) */}
              <div
                className={`relative group p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
                  type === "expense"
                    ? "bg-error/5 border-error/20 focus-within:border-error/50 focus-within:ring-4 focus-within:ring-error/10"
                    : type === "transfer"
                      ? "bg-primary/5 border-primary/20 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10"
                      : "bg-secondary/5 border-secondary/20 focus-within:border-secondary/50 focus-within:ring-4 focus-within:ring-secondary/10"
                }`}
              >
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">
                  {t("expenses.transactionModal.labels.amount")}
                </label>
                <div className="flex items-center">
                  <span
                    className={`text-2xl sm:text-3xl font-black mr-2 ${
                      type === "expense"
                        ? "text-error/70"
                        : type === "transfer"
                          ? "text-primary/70"
                          : "text-secondary/70"
                    }`}
                  >
                    {currency.symbol}
                  </span>
                  <input
                    autoFocus
                    className={`w-full bg-transparent border-none text-3xl sm:text-4xl font-black placeholder:text-on-surface-variant/30 outline-none p-0 focus:ring-0 ${
                      type === "income" ? "text-emerald-400" : type === "transfer" ? "text-primary" : "text-white"
                    }`}
                    type="number"
                    step="0.01"
                    placeholder={t("expenses.transactionModal.placeholders.amount")}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              {/* Category or Reserve Selector */}
              <div className="space-y-2 relative z-50">
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                  {type === "transfer"
                    ? t("expenses.transactionModal.labels.destination")
                    : t("expenses.transactionModal.labels.category")}
                </label>

                {type === "transfer" ? (
                  <CustomSelect
                    value={reserveId}
                    options={[
                      ...(reserveId === ""
                        ? [{ value: "", label: t("expenses.transactionModal.placeholders.reserve") }]
                        : []),
                      ...reserves.map((r) => ({ value: r.id, label: `${r.icon || "💰"} ${r.name}` })),
                    ]}
                    onChange={setReserveId}
                    className="w-full bg-surface-container border-none rounded-xl py-1 text-sm font-semibold focus:ring-2 focus:ring-primary/50"
                  />
                ) : isCreatingCategory ? (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center bg-surface-container border border-outline-variant/30 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 rounded-xl px-1 transition-all">
                        <div className="relative flex items-center">
                          <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-transparent border-none outline-none text-xl sm:text-2xl hover:bg-surface-container-high rounded-lg transition-colors select-none"
                          >
                            {newCategoryEmoji}
                          </button>

                          {showEmojiPicker && (
                            <div className="absolute top-[110%] left-0 z-[60] shadow-2xl rounded-xl animate-in fade-in zoom-in-95 border border-outline-variant/20">
                              <EmojiPicker
                                emojiStyle={EmojiStyle.NATIVE}
                                onEmojiClick={(e) => {
                                  setNewCategoryEmoji(e.emoji);
                                  setShowEmojiPicker(false);
                                }}
                                skinTonesDisabled
                                theme={"dark" as any}
                                width={window.innerWidth < 400 ? 280 : 320}
                                height={350}
                              />
                            </div>
                          )}
                        </div>
                        <div className="w-px h-6 bg-outline-variant/30 mx-1" />
                        <input
                          type="text"
                          className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm font-semibold text-on-surface placeholder:text-on-surface-variant/40 py-3 sm:py-3.5 px-3"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder={t("expenses.transactionModal.createCategory.placeholder")}
                          autoFocus
                        />
                      </div>

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
                        className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-primary text-on-primary flex items-center justify-center hover:opacity-90 active:scale-95 transition-all outline-none"
                      >
                        <span className="material-symbols-outlined text-[20px]">check</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsCreatingCategory(false);
                          setNewCategoryName("");
                          setCategoryError(null);
                        }}
                        className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-surface-container-high border border-outline-variant/10 text-on-surface-variant flex items-center justify-center hover:bg-surface-container-highest transition-colors outline-none"
                      >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                      </button>
                    </div>
                    {categoryError && (
                      <p className="text-xs font-bold text-error px-2 flex items-center gap-1">
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
                    className="w-full bg-surface-container border-none rounded-xl py-1 text-sm font-semibold focus:ring-2 focus:ring-primary/50"
                    onAddAction={() => setIsCreatingCategory(true)}
                    addActionLabel={t("expenses.transactionModal.createCategory.title")}
                  />
                )}
              </div>

              {/* Date & Description Row (Side by side) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-40">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                    {t("expenses.transactionModal.labels.date")}
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full bg-surface-container border-none focus:ring-2 focus:ring-primary/50 rounded-xl py-3 sm:py-3.5 px-4 text-sm font-semibold text-on-surface outline-none [&::-webkit-calendar-picker-indicator]:opacity-50"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                    {t("expenses.transactionModal.labels.description")}
                  </label>
                  <input
                    className="w-full bg-surface-container border-none focus:ring-2 focus:ring-primary/50 rounded-xl py-3 sm:py-3.5 px-4 text-sm font-semibold text-on-surface placeholder:text-on-surface-variant/40 outline-none"
                    placeholder={t("expenses.transactionModal.placeholders.description")}
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              {/* Review Toggle */}
              <div className="flex items-center justify-between p-4 bg-surface-container rounded-2xl border border-outline-variant/10">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${needsReview ? "bg-primary/20 text-primary" : "bg-surface-container-high text-on-surface-variant"}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">inbox</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface">{t("expenses.transactionModal.review.label")}</p>
                    <p className="text-[10px] font-medium text-on-surface-variant/60">
                      {t("expenses.transactionModal.review.desc")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setNeedsReview(!needsReview)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 outline-none ${needsReview ? "bg-primary" : "bg-surface-container-highest"}`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${needsReview ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 sm:p-6 bg-surface-container-lowest border-t border-outline-variant/10 flex items-center gap-3 sm:gap-4 rounded-b-3xl">
              <button
                onClick={onClose}
                className="flex-1 py-3 sm:py-3.5 px-2 sm:px-4 rounded-xl font-bold text-xs sm:text-sm text-on-surface-variant hover:bg-surface-container-high transition-all"
                disabled={isSaving || isDeleting}
              >
                {t("common.cancel")}
              </button>

              {isEditing && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isSaving || isDeleting}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl text-on-surface-variant/40 hover:text-error hover:bg-error/10 transition-all border border-outline-variant/10"
                  title={t("expenses.transactionModal.actions.delete")}
                >
                  <span className="material-symbols-outlined text-[18px] sm:text-[20px]">delete</span>
                </button>
              )}

              <button
                onClick={handleSave}
                disabled={isSaving || isDeleting || !amount}
                className="flex-[2] py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm text-on-primary bg-primary hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none truncate"
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
