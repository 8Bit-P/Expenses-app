import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSubscriptions } from "../../hooks/useSubscriptions";
import SubscriptionMetrics from "./components/SubscriptionMetrics";
import SubscriptionCard from "./components/SubscriptionCard";
import UpcomingRenewals from "./components/UpcomingRenewals";
import SubscriptionModal from "./components/SubscriptionModal";
import type { Subscription } from "../../types/expenses";
import { useIsMobile } from "../../hooks/useIsMobile";
import PageHeader from "../../components/ui/PageHeader";
import Panel from "../../components/ui/Panel";
import { cn } from "../../utils/cn";

export default function Subscriptions() {
  const { t } = useTranslation();
  const { subscriptions, loading } = useSubscriptions();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  const isMobile = useIsMobile(768);
  const variant = isMobile ? "list" : viewMode;

  const handleManage = (s: Subscription) => {
    setSelectedSubscription(s);
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setSelectedSubscription(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubscription(null);
  };

  const isEmpty = !loading && subscriptions.length === 0;

  const viewToggle = (
    <div className="hidden md:inline-flex p-0.5 rounded-lg bg-surface-container border border-outline-variant">
      {(["grid", "list"] as const).map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => setViewMode(mode)}
          aria-pressed={viewMode === mode}
          className={cn(
            "w-8 h-7 rounded-md flex items-center justify-center transition-colors",
            viewMode === mode
              ? "bg-surface-container-lowest text-on-surface shadow-sm"
              : "text-on-surface-variant hover:text-on-surface",
          )}
        >
          <span className="material-symbols-outlined text-[18px]">{mode === "grid" ? "grid_view" : "list"}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 w-full pb-24">
      <PageHeader
        title={t("subscriptions.title")}
        description={t("subscriptions.subtitle")}
        actions={
          <button
            onClick={handleOpenNew}
            className="h-9 px-4 rounded-lg bg-accent text-on-accent text-sm font-medium inline-flex items-center gap-1.5 hover:opacity-90 active:scale-[0.98] transition"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span className="hidden md:inline">{t("subscriptions.newButton")}</span>
            <span className="md:hidden">{t("subscriptions.addButton")}</span>
          </button>
        }
      />

      <SubscriptionMetrics subscriptions={subscriptions} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-5 items-start">
        <Panel
          title={t("subscriptions.listTitle")}
          subtitle={!loading && !isEmpty ? t("subscriptions.metrics.total", { count: subscriptions.length }) : undefined}
          actions={!isEmpty ? viewToggle : undefined}
          flush
        >
          {isEmpty ? (
            <div className="border-t border-outline-variant px-6 py-14 flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-[28px] text-outline">event_repeat</span>
              <p className="text-sm font-medium text-on-surface mt-3">{t("subscriptions.empty.title")}</p>
              <p className="text-[13px] text-on-surface-variant mt-1 max-w-sm">{t("subscriptions.empty.subtitle")}</p>
              <button
                onClick={handleOpenNew}
                className="mt-5 h-9 px-4 rounded-lg bg-primary text-on-primary text-sm font-medium hover:opacity-90 active:scale-[0.98] transition"
              >
                {t("subscriptions.empty.button")}
              </button>
            </div>
          ) : variant === "list" ? (
            <div className="border-t border-outline-variant">
              <div className="hidden md:grid grid-cols-[36px_minmax(0,1fr)_100px_120px_120px] items-center gap-x-4 px-5 h-9 bg-surface-container-low border-b border-outline-variant eyebrow">
                <span />
                <span>{t("subscriptions.modal.nameLabel")}</span>
                <span>{t("subscriptions.modal.cycleLabel")}</span>
                <span>{t("subscriptions.modal.dateLabel")}</span>
                <span className="text-right">{t("subscriptions.modal.amountLabel")}</span>
              </div>
              <div className="divide-y divide-outline-variant">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 px-5 h-14">
                        <div className="w-9 h-9 animate-pulse bg-surface-container rounded-lg" />
                        <div className="h-3 w-40 animate-pulse bg-surface-container rounded-lg" />
                        <div className="ml-auto h-3 w-16 animate-pulse bg-surface-container rounded-lg" />
                      </div>
                    ))
                  : subscriptions.map((s) => (
                      <SubscriptionCard key={s.id} subscription={s} onManage={handleManage} variant="list" />
                    ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 px-5 pb-5">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-[116px] animate-pulse bg-surface-container rounded-lg" />
                  ))
                : subscriptions.map((s) => (
                    <SubscriptionCard key={s.id} subscription={s} onManage={handleManage} variant="grid" />
                  ))}
            </div>
          )}
        </Panel>

        <div className="w-full lg:sticky lg:top-24">
          <UpcomingRenewals subscriptions={subscriptions} />
        </div>
      </div>

      <SubscriptionModal isOpen={isModalOpen} onClose={handleCloseModal} subscription={selectedSubscription} />
    </div>
  );
}
