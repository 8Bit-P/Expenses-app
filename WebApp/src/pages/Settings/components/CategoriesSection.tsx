import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useCategories } from "../../../hooks/useCategories";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import DeleteConfirmModal from "../../../components/ui/DeleteConfirmModal";
import type { Category } from "../../../types/expenses";

export default function CategoriesSection() {
  const { t } = useTranslation();
  const { categories, addCategory, deleteCategory, loading } = useCategories();

  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryEmoji, setNewCategoryEmoji] = useState("📦");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete matching state
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const emojiContainerRef = useRef<HTMLDivElement>(null);

  // Close emoji picker on outside click
  useEffect(() => {
    if (!showEmojiPicker) return;
    const handler = (e: MouseEvent) => {
      if (!emojiContainerRef.current?.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showEmojiPicker]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsSubmitting(true);
    try {
      await addCategory({ name: newCategoryName, emoji: newCategoryEmoji });
      toast.success(t("settings.categories.toasts.added"), { 
        description: t("settings.categories.toasts.addedDesc", { emoji: newCategoryEmoji, name: newCategoryName }) 
      });
      setNewCategoryName("");
      setNewCategoryEmoji("📦");
      setShowEmojiPicker(false);
      setIsAdding(false);
    } catch (error: any) {
      toast.error(t("settings.categories.toasts.addFailed"), { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await deleteCategory(categoryToDelete.id);
      toast.success(t("settings.categories.toasts.deleted"), { 
        description: t("settings.categories.toasts.deletedDesc") 
      });
    } catch (error: any) {
      toast.error(t("settings.categories.toasts.deleteFailed"), { 
        description: error.message || t("settings.categories.toasts.deleteError") 
      });
    } finally {
      setIsDeleting(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <section className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <h3 className="text-xl font-headline font-black text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">category</span>
            {t("settings.categories.title")}
          </h3>
          <p className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant mt-1">
            {t("settings.categories.subtitle")}
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-secondary hover:text-white transition-all duration-300"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        )}
      </div>

      {/* Categories List */}
      <div className="flex-1 space-y-2 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar relative z-10">
        {loading ? (
          <div className="text-center py-6 text-on-surface-variant/50 animate-pulse">
            <div className="w-8 h-8 rounded-full border-2 border-outline-variant/30 border-t-primary animate-spin mx-auto mb-2" />
            <p className="text-xs font-bold">{t("settings.categories.loading")}</p>
          </div>
        ) : (
          categories.map((cat: Category) => (
            <div
              key={cat.id}
              className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform">
                {cat.emoji || "📦"}
              </div>
              <span className="font-bold text-sm text-on-surface flex-1">{cat.name}</span>
              <button 
                onClick={() => setCategoryToDelete({ id: cat.id, name: cat.name })}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-on-surface-variant hover:text-error p-1"
                title={t("settings.categories.deleteTitle")}
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
          ))
        )}

        {!loading && categories.length === 0 && !isAdding && (
          <div className="text-center py-6 text-on-surface-variant/50">
            <span className="material-symbols-outlined text-3xl mb-2">inventory_2</span>
            <p className="text-xs font-bold">{t("settings.categories.noCategories")}</p>
          </div>
        )}
      </div>

      {/* Inline Add Form */}
      {isAdding && (
        <form
          onSubmit={handleAddCategory}
          className="mt-4 pt-4 border-t border-outline-variant/10 animate-in slide-in-from-bottom-2 fade-in relative z-20"
        >
          <div className="flex gap-2 relative" ref={emojiContainerRef}>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-12 h-10 flex items-center justify-center bg-surface-container hover:bg-surface-container-high rounded-xl text-lg transition-colors focus:ring-2 focus:ring-secondary/50 outline-none select-none"
            >
              {newCategoryEmoji}
            </button>
            
            {showEmojiPicker && (
              <div className="absolute bottom-[110%] left-0 z-[60] shadow-2xl rounded-xl animate-in fade-in zoom-in-95 border border-outline-variant/20">
                <EmojiPicker
                  emojiStyle={EmojiStyle.NATIVE}
                  onEmojiClick={(e) => {
                    setNewCategoryEmoji(e.emoji);
                    setShowEmojiPicker(false);
                  }}
                  skinTonesDisabled
                  theme={"dark" as any}
                  width={300}
                  height={320}
                />
              </div>
            )}

            <input
              autoFocus
              type="text"
              placeholder={t("settings.categories.addPlaceholder")}
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1 bg-surface-container border-none rounded-xl px-4 text-sm font-bold text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-secondary/50 outline-none"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewCategoryName("");
                setNewCategoryEmoji("📦");
                setShowEmojiPicker(false);
              }}
              disabled={isSubmitting}
              className="flex-1 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={!newCategoryName.trim() || isSubmitting}
              className="flex-1 py-2 rounded-xl text-xs font-black bg-secondary text-white shadow-md shadow-secondary/20 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting && <span className="material-symbols-outlined text-[14px] animate-spin">autorenew</span>}
              {t("common.save")}
            </button>
          </div>
        </form>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={confirmDelete}
        title={t("settings.categories.deleteTitle")}
        message={t("settings.categories.deleteConfirm")}
        itemName={categoryToDelete?.name}
        isExecuting={isDeleting}
      />
    </section>
  );
}
