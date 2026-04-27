import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSubscriptions } from "../../hooks/useSubscriptions";
import SubscriptionMetrics from "./components/SubscriptionMetrics";
import SubscriptionCard from "./components/SubscriptionCard";
import UpcomingRenewals from "./components/UpcomingRenewals";
import SubscriptionModal from "./components/SubscriptionModal";
import type { Subscription } from "../../types/expenses";
import { useIsMobile } from "../../hooks/useIsMobile";

export default function Subscriptions() {
  const { t } = useTranslation();
  const { subscriptions, loading } = useSubscriptions();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  const isMobile = useIsMobile(768);

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

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-7xl mx-auto w-full px-2 md:px-0 pb-32">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-on-surface font-headline">
            {t("subscriptions.title")}
          </h1>
          <p className="text-on-surface-variant font-medium text-sm">
            {t("subscriptions.subtitle")}
          </p>
        </div>

        {/* Added: Global Add Button (Crucial for when the empty state is hidden!) */}
        {/* Secondary Page Action: Ghost style on desktop, icon style on mobile */}
        <button
          onClick={handleOpenNew}
          className="group flex items-center justify-center gap-2 border-2 border-primary/20 md:border-primary/40 text-primary px-4 md:px-5 py-2 rounded-xl font-bold text-sm hover:bg-primary/5 hover:border-primary active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:rotate-90 transition-transform duration-300">
            add
          </span>
          <span className="hidden md:inline">{t("subscriptions.newButton")}</span>
          <span className="md:hidden">{t("subscriptions.addButton")}</span>
        </button>
      </div>

      {/* Metrics Highlights */}
      <SubscriptionMetrics subscriptions={subscriptions} loading={loading} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Grid Area */}
        <div className="flex-1 w-full lg:min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black tracking-tight font-headline">
              {t("subscriptions.listTitle")}
            </h2>

            {/* View Toggle - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-1.5 bg-surface-container-lowest rounded-full p-1.5 border border-outline-variant/10 shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-full transition-all ${
                  viewMode === "grid"
                    ? "bg-surface-container-high text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-full transition-all ${
                  viewMode === "list"
                    ? "bg-surface-container-high text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">list</span>
              </button>
            </div>
          </div>

          {/* Empty State */}
          {!loading && subscriptions.length === 0 ? (
            <div className="relative overflow-hidden bg-surface-container-lowest border border-dashed border-outline-variant/30 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-6 shadow-sm">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant/40 border border-outline-variant/10 relative z-10">
                <span className="material-symbols-outlined text-4xl">inventory_2</span>
              </div>

              <div className="relative z-10 space-y-2">
                <p className="text-xl font-black text-on-surface font-headline tracking-tight">
                  {t("subscriptions.empty.title")}
                </p>
                <p className="text-sm font-medium text-on-surface-variant/80 max-w-sm mx-auto">
                  {t("subscriptions.empty.subtitle")}
                </p>
              </div>

              <button
                onClick={handleOpenNew}
                className="relative z-10 bg-primary/10 text-primary hover:bg-primary/20 px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 border border-primary/10"
              >
                {t("subscriptions.empty.button")}
              </button>
            </div>
          ) : (
            /* Populated State */
            <div
              className={`grid gap-4 transition-all duration-300 ${
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
              }`}
            >
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-48 bg-surface-container-lowest/50 rounded-2xl animate-pulse border border-outline-variant/10"
                    />
                  ))
                : subscriptions.map((s) => (
                    <SubscriptionCard
                      key={s.id}
                      subscription={s}
                      onManage={handleManage}
                      variant={isMobile ? "list" : viewMode}
                    />
                  ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-96 shrink-0 sticky top-24">
          <UpcomingRenewals subscriptions={subscriptions} />
        </div>
      </div>

      {/* Creation/Edit Modal */}
      <SubscriptionModal isOpen={isModalOpen} onClose={handleCloseModal} subscription={selectedSubscription} />
    </div>
  );
}
