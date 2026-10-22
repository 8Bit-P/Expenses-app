import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useCategories } from "../../../hooks/useCategories";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import DeleteConfirmModal from "../../../components/ui/DeleteConfirmModal";
import type { Category } from "../../../types/expenses";
import Panel from "../../../components/ui/Panel";
import SettingsGroup from "./SettingsGroup";

export default function CategoriesSection() {
  const { t } = useTranslation();
  const { categories, addCategory, updateCategory, deleteCategory, loading } = useCategories();

  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryEmoji, setNewCategoryEmoji] = useState("📦");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit state
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryEmoji, setEditCategoryEmoji] = useState("📦");
  const [isEditingSubmitting, setIsEditingSubmitting] = useState(false);

  // Delete matching state
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const emojiContainerRef = useRef<HTMLDivElement>(null);
  const editEmojiContainerRef = useRef<HTMLDivElement>(null);

  // Close emoji picker on outside click
  useEffect(() => {
    if (!showEmojiPicker) return;
    const handler = (e: MouseEvent) => {
      if (
        !emojiContainerRef.current?.contains(e.target as Node) &&
        !editEmojiContainerRef.current?.contains(e.target as Node)
      ) {
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
    } catch (error) {
      toast.error(t("settings.categories.toasts.addFailed"), { description: (error as Error).message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCategoryName.trim() || !editingCategoryId) return;

    setIsEditingSubmitting(true);
    try {
      await updateCategory({ id: editingCategoryId, name: editCategoryName, emoji: editCategoryEmoji });
      toast.success(t("settings.categories.toasts.updated") || "Category updated", { 
        description: t("settings.categories.toasts.updatedDesc", { emoji: editCategoryEmoji, name: editCategoryName }) || "Category was successfully updated" 
      });
      setEditingCategoryId(null);
      setShowEmojiPicker(false);
    } catch (error) {
      toast.error(t("settings.categories.toasts.updateFailed") || "Update failed", { description: (error as Error).message });
    } finally {
      setIsEditingSubmitting(false);
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
    } catch (error) {
      toast.error(t("settings.categories.toasts.deleteFailed"), { 
        description: (error as Error).message || t("settings.categories.toasts.deleteError") 
      });
    } finally {
      setIsDeleting(false);
      setCategoryToDelete(null);
    }
  };

  const iconButtonClass =
    "w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors disabled:opacity-50";

  return (
    <SettingsGroup title={t("settings.categories.title")} description={t("settings.categories.subtitle")}>
      <Panel flush>
        {/* Categories List */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-outline-variant">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-on-surface-variant">
              <span className="w-4 h-4 rounded-full border-2 border-outline-variant border-t-on-surface animate-spin" />
              <p className="text-xs">{t("settings.categories.loading")}</p>
            </div>
          ) : (
            categories.map((cat: Category) =>
              editingCategoryId === cat.id ? (
                <form
                  key={cat.id}
                  onSubmit={handleUpdateCategory}
                  className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-low relative z-20"
                >
                  <div className="relative" ref={editEmojiContainerRef}>
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-lg transition-colors select-none"
                    >
                      {editCategoryEmoji}
                    </button>

                    {showEmojiPicker && (
                      <div className="absolute top-[115%] left-0 z-[60] shadow-xl rounded-lg border border-outline-variant">
                        <EmojiPicker
                          emojiStyle={EmojiStyle.NATIVE}
                          onEmojiClick={(e) => {
                            setEditCategoryEmoji(e.emoji);
                            setShowEmojiPicker(false);
                          }}
                          skinTonesDisabled
                          theme={Theme.DARK}
                          width={300}
                          height={320}
                        />
                      </div>
                    )}
                  </div>

                  <input
                    autoFocus
                    type="text"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    className="flex-1 min-w-0 h-9 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface focus:border-on-surface focus:ring-0 outline-none transition-colors"
                  />

                  <button
                    type="button"
                    onClick={() => setEditingCategoryId(null)}
                    disabled={isEditingSubmitting}
                    className={iconButtonClass}
                    title={t("common.cancel") || "Cancel"}
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                  <button
                    type="submit"
                    disabled={!editCategoryName.trim() || isEditingSubmitting}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-on-primary hover:opacity-90 transition disabled:opacity-50"
                    title={t("common.save") || "Save"}
                  >
                    {isEditingSubmitting ? (
                      <span className="material-symbols-outlined text-[18px] animate-spin">autorenew</span>
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    )}
                  </button>
                </form>
              ) : (
                <div
                  key={cat.id}
                  className="flex items-center gap-3 px-5 h-12 hover:bg-surface-container-low transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-base shrink-0">
                    {cat.emoji || "📦"}
                  </div>
                  <span className="text-sm text-on-surface flex-1 truncate">{cat.name}</span>
                  <div className="flex items-center gap-0.5 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingCategoryId(cat.id);
                        setEditCategoryName(cat.name);
                        setEditCategoryEmoji(cat.emoji || "📦");
                      }}
                      className={iconButtonClass}
                      title={t("settings.categories.editTitle") || "Edit"}
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      onClick={() => setCategoryToDelete({ id: cat.id, name: cat.name })}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-error/10 hover:text-error transition-colors"
                      title={t("settings.categories.deleteTitle")}
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              ),
            )
          )}

          {!loading && categories.length === 0 && !isAdding && (
            <div className="flex flex-col items-center py-8 text-on-surface-variant">
              <span className="material-symbols-outlined text-[24px] text-outline">category</span>
              <p className="text-[13px] mt-2">{t("settings.categories.noCategories")}</p>
            </div>
          )}
        </div>

        {/* Inline Add Form */}
        {isAdding ? (
          <form
            onSubmit={handleAddCategory}
            className="px-5 py-4 border-t border-outline-variant bg-surface-container-low rounded-b-2xl relative z-20"
          >
            <div className="flex gap-2 relative" ref={emojiContainerRef}>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-lg transition-colors select-none"
              >
                {newCategoryEmoji}
              </button>

              {showEmojiPicker && (
                <div className="absolute bottom-[115%] left-0 z-[60] shadow-xl rounded-lg border border-outline-variant">
                  <EmojiPicker
                    emojiStyle={EmojiStyle.NATIVE}
                    onEmojiClick={(e) => {
                      setNewCategoryEmoji(e.emoji);
                      setShowEmojiPicker(false);
                    }}
                    skinTonesDisabled
                    theme={Theme.DARK}
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
                className="flex-1 min-w-0 h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface placeholder:text-outline focus:border-on-surface focus:ring-0 outline-none transition-colors"
              />
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewCategoryName("");
                  setNewCategoryEmoji("📦");
                  setShowEmojiPicker(false);
                }}
                disabled={isSubmitting}
                className="h-9 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors disabled:opacity-50"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                disabled={!newCategoryName.trim() || isSubmitting}
                className="h-9 px-4 rounded-lg bg-primary text-on-primary text-sm font-medium hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
              >
                {isSubmitting && <span className="material-symbols-outlined text-[16px] animate-spin">autorenew</span>}
                {t("common.save")}
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center gap-3 px-5 h-12 border-t border-outline-variant text-sm font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors rounded-b-2xl"
          >
            <span className="w-8 h-8 rounded-lg border border-dashed border-outline flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">add</span>
            </span>
            {t("expenses.transactionModal.createCategory.title")}
          </button>
        )}
      </Panel>

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
    </SettingsGroup>
  );
}
