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
import { supabase } from "../../../lib/supabase";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: any;
}

export default function TransactionModal({ isOpen, onClose, transaction }: TransactionModalProps) {
  const { categories, addCategory, getOrCreateUnknownCategory } = useCategories();
  const { addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { currency } = useUserPreferences();

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [reserveId, setReserveId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [needsReview, setNeedsReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { reserves } = useReserves();

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

  if (!isOpen) return null;

  const isEditing = !!transaction;

  const handleSave = async () => {
    if (!amount) return;

    setIsSubmitting(true);
    let finalCategoryId = categoryId;

    try {
      if (!finalCategoryId) {
        finalCategoryId = await getOrCreateUnknownCategory();
        setCategoryId(finalCategoryId);
      }

      const data = {
        type,
        amount: parseFloat(amount),
        description,
        category_id: type === "transfer" ? null : finalCategoryId,
        reserve_id: type === "transfer" ? reserveId : null,
        date,
        needs_review: needsReview,
      };

      if (isEditing) {
        // If it was a transfer and still is, or became one, handle the math sync
        if (type === "transfer" && reserveId) {
          const oldAmount = transaction.amount;
          const newAmount = parseFloat(amount);
          const delta = newAmount - oldAmount;

          if (delta !== 0) {
            // Update the reserve's current_amount
            const { data: reserveData } = await supabase
              .from("reserves")
              .select("current_amount")
              .eq("id", reserveId)
              .single();

            await supabase
              .from("reserves")
              .update({ current_amount: (reserveData?.current_amount || 0) + delta })
              .eq("id", reserveId);
          }
        }
        await updateTransaction({ id: transaction.id, updates: data });
      } else {
        await addTransaction(data);
      }

      toast.success(isEditing ? "Transaction updated" : "Transaction recorded", {
        description: `${description || (type === "expense" ? "Expense" : "Income")} of ${currency.symbol}${amount} secured.`,
      });

      onClose();
    } catch (err: any) {
      toast.error("Save failed", {
        description: err.message || "Something went wrong while saving.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!transaction?.id) return;
    setIsSubmitting(true);
    try {
      await deleteTransaction(transaction.id);
      toast.success("Transaction deleted");
      onClose();
    } catch (err: any) {
      toast.error("Deletion failed", {
        description: err.message || "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

          {isEditing && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSubmitting}
              className="w-12 h-12 flex items-center justify-center rounded-xl text-on-surface-variant/40 hover:text-error hover:bg-error/10 transition-all border border-outline-variant/10"
              title="Delete Transaction"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          )}

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest/95 backdrop-blur-xl w-full max-w-xl rounded-2xl shadow-2xl border border-outline-variant/20 ring-1 ring-black/5 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-visible">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-outline-variant/5">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-2xl font-black text-on-surface tracking-tight font-headline">
              {isEditing ? "Modify Transaction" : "New Transaction"}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <p className="text-on-surface-variant/80 text-sm font-medium">
            {isEditing ? "Update the details of your ledger entry." : "Record your financial movements with precision."}
          </p>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Type Toggle */}
          <div className="flex bg-surface-container-low p-1.5 rounded-xl gap-1 border border-outline-variant/5">
            <button
              onClick={() => setType("expense")}
              disabled={isEditing && transaction?.reserve_id}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-black text-xs uppercase tracking-widest transition-all duration-300 disabled:opacity-50 ${
                type === "expense"
                  ? "bg-error text-on-error shadow-md shadow-error/20 scale-[1.02]"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">arrow_circle_down</span>
              Expense
            </button>
            <button
              onClick={() => setType("transfer")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                type === "transfer"
                  ? "bg-primary text-on-primary shadow-md shadow-primary/20 scale-[1.02]"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
              Transfer
            </button>
            <button
              onClick={() => setType("income")}
              disabled={isEditing && transaction?.reserve_id}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-black text-xs uppercase tracking-widest transition-all duration-300 disabled:opacity-50 ${
                type === "income"
                  ? "bg-secondary text-on-secondary shadow-md shadow-secondary/20 scale-[1.02]"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">arrow_circle_up</span>
              Income
            </button>
          </div>

          {/* Amount Input (Hero Section) */}
          <div
            className={`relative group p-5 rounded-2xl border transition-all duration-300 ${
              type === "expense" 
                ? "bg-error/5 border-error/20 focus-within:border-error/50 focus-within:ring-4 focus-within:ring-error/10" 
                : type === "transfer"
                ? "bg-primary/5 border-primary/20 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10"
                : "bg-secondary/5 border-secondary/20 focus-within:border-secondary/50 focus-within:ring-4 focus-within:ring-secondary/10"
            }`}
          >
            <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">
              Amount
            </label>
            <div className="flex items-center">
              <span
                className={`text-3xl font-black mr-2 ${
                  type === "expense" ? "text-error/70" : type === "transfer" ? "text-primary/70" : "text-secondary/70"
                }`}
              >
                {currency.symbol}
              </span>
              <input
                autoFocus
                className={`w-full bg-transparent border-none text-4xl font-black placeholder:text-on-surface-variant/30 outline-none p-0 focus:ring-0 ${
                  type === "income" ? "text-emerald-400" : type === "transfer" ? "text-primary" : "text-white"
                }`}
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Category or Reserve Selector */}
          <div className="space-y-2 relative z-50">
            <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
              {type === "transfer" ? "Destination Reserve" : "Category"}
            </label>
            
            {type === "transfer" ? (
              <CustomSelect
                value={reserveId}
                options={[
                  ...(reserveId === "" ? [{ value: "", label: "Select Reserve" }] : []),
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
                        className="w-12 h-12 flex items-center justify-center bg-transparent border-none outline-none text-2xl hover:bg-surface-container-high rounded-lg transition-colors select-none"
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
                            width={320}
                            height={350}
                          />
                        </div>
                      )}
                    </div>
                    <div className="w-px h-6 bg-outline-variant/30 mx-1" />
                    <input
                      type="text"
                      className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm font-semibold text-on-surface placeholder:text-on-surface-variant/40 py-3.5 px-3"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Name this category..."
                      autoFocus
                    />
                  </div>

                  <button
                    onClick={async () => {
                      if (!newCategoryName) {
                        setCategoryError("Name required");
                        return;
                      }
                      setIsSubmitting(true);
                      setCategoryError(null);
                      try {
                        const newCat = await addCategory({ name: newCategoryName, emoji: newCategoryEmoji });
                        toast.success("Category created", {
                          description: `${newCategoryEmoji} ${newCategoryName} is now available.`,
                        });
                        setCategoryId(newCat.id);
                        setIsCreatingCategory(false);
                        setNewCategoryName("");
                        setNewCategoryEmoji("📦");
                      } catch (e: any) {
                        toast.error("Category failed", {
                          description: e.message || "Error creating category",
                        });
                        setCategoryError(e.message || "Error creating category");
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    disabled={isSubmitting}
                    className="w-14 h-14 shrink-0 rounded-xl bg-primary text-on-primary flex items-center justify-center hover:opacity-90 active:scale-95 transition-all outline-none"
                  >
                    <span className="material-symbols-outlined text-[20px]">check</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsCreatingCategory(false);
                      setNewCategoryName("");
                      setCategoryError(null);
                    }}
                    className="w-14 h-14 shrink-0 rounded-xl bg-surface-container-high border border-outline-variant/10 text-on-surface-variant flex items-center justify-center hover:bg-surface-container-highest transition-colors outline-none"
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
                  ...(categoryId === "" ? [{ value: "", label: "Select Category" }] : []),
                  ...categories.map((cat: Category) => ({ value: cat.id, label: `${cat.emoji ?? ""} ${cat.name}` })),
                ]}
                onChange={setCategoryId}
                className="w-full bg-surface-container border-none rounded-xl py-1 text-sm font-semibold focus:ring-2 focus:ring-primary/50"
                onAddAction={() => setIsCreatingCategory(true)}
                addActionLabel="Create new category"
              />
            )}
          </div>

          {/* Date & Description Row (Side by side) */}
          <div className="grid grid-cols-2 gap-4 relative z-40">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full bg-surface-container border-none focus:ring-2 focus:ring-primary/50 rounded-xl py-3.5 px-4 text-sm font-semibold text-on-surface outline-none [&::-webkit-calendar-picker-indicator]:opacity-50"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                Description
              </label>
              <input
                className="w-full bg-surface-container border-none focus:ring-2 focus:ring-primary/50 rounded-xl py-3.5 px-4 text-sm font-semibold text-on-surface placeholder:text-on-surface-variant/40 outline-none"
                placeholder="e.g. Grocery Run"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Review Toggle */}
          <div className="flex items-center justify-between p-4 bg-surface-container rounded-2xl border border-outline-variant/10">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${needsReview ? "bg-primary/20 text-primary" : "bg-surface-container-high text-on-surface-variant"}`}>
                <span className="material-symbols-outlined text-[18px]">inbox</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">Mark for Review</p>
                <p className="text-[10px] font-medium text-on-surface-variant/60">Place in your dashboard inbox</p>
              </div>
            </div>
            <button
              onClick={() => setNeedsReview(!needsReview)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 outline-none ${needsReview ? "bg-primary" : "bg-surface-container-highest"}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${needsReview ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-surface-container-lowest border-t border-outline-variant/10 flex items-center gap-4 rounded-b-3xl">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 px-4 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container-high transition-all"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          {isEditing && (
            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="w-12 h-12 flex items-center justify-center rounded-xl text-on-surface-variant/40 hover:text-error hover:bg-error/10 transition-all border border-outline-variant/10"
              title="Delete Transaction"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={isSubmitting || !amount}
            className="flex-[2] py-3.5 px-4 rounded-xl font-bold text-sm text-on-primary bg-primary hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none"
          >
            {isSubmitting ? "Saving Entry..." : isEditing ? "Save Changes" : "Confirm Entry"}
          </button>
        </div>
      </div>
      <VaultConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Transaction?"
        description="This will permanently remove this entry from your vault and reverse any linked reserve updates."
        confirmLabel="Purge Entry"
        cancelLabel="Keep Entry"
        isLoading={isSubmitting}
        variant="danger"
      />
    </div>
  );
}
