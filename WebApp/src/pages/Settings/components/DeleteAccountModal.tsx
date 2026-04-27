import { useTranslation } from "react-i18next";
import { useDeleteAccount } from "../../../hooks/useDeleteAccount";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const { t } = useTranslation();
  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  if (!isOpen) return null;

  const handleDelete = () => {
    deleteAccount();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-error/20 ring-1 ring-black/5 animate-in zoom-in-95 duration-200">
        <div className="p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-error-container text-error rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="material-symbols-outlined text-3xl">warning</span>
          </div>
          <h3 className="text-2xl font-extrabold text-on-surface font-headline tracking-tight">{t("settings.danger.modal.title")}</h3>
          <p className="text-on-surface-variant text-sm font-medium">
            {t("settings.danger.modal.desc")}
          </p>
        </div>

        <div className="p-4 bg-surface-container-low flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-on-surface hover:bg-surface-container-highest transition-colors disabled:opacity-50"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-error text-white shadow-md hover:bg-error/90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t("settings.danger.modal.deleting")}
              </>
            ) : (
              t("settings.danger.modal.confirm")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
