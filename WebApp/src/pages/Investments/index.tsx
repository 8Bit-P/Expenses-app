import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useInvestments } from "../../hooks/useInvestments";
import PageHeader from "../../components/ui/PageHeader";
import AllocationDonut from "./components/AllocationDonut";
import LogSnapshotModal from "./components/LogSnapshotModal";
import VaultAssetsList from "./components/VaultAssetsList";
import HeroMetrics from "./components/HeroMetrics";
import PerformanceChart from "./components/PerformanceChart";
import SnapshotHistoryTable from "./components/SnapshotHistoryTable";

export default function Investments() {
  const { t } = useTranslation();
  const { assets, metrics, isLoading, error } = useInvestments();
  const [stealthMode, setStealthMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6" aria-busy="true">
        <div className="pb-5 border-b border-outline-variant space-y-3">
          <div className="h-3 w-24 animate-pulse bg-surface-container rounded-lg" />
          <div className="h-10 w-56 animate-pulse bg-surface-container rounded-lg" />
        </div>
        <div className="h-44 animate-pulse bg-surface-container rounded-2xl" />
        <div className="h-80 animate-pulse bg-surface-container rounded-2xl" />
        <p className="text-sm text-on-surface-variant text-center">{t("investments.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-2 text-center">
        <span className="material-symbols-outlined text-[28px] text-error">error</span>
        <p className="text-sm font-medium text-on-surface">{t("investments.error")}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow={t("investments.header.activeAssets", { count: assets.length })}
        title={t("investments.header.title")}
        description={t("investments.header.subtitle")}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="h-9 px-4 rounded-lg bg-accent text-on-accent text-sm font-medium hover:opacity-90 active:scale-[0.98] transition inline-flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            {t("investments.header.logSnapshot")}
          </button>
        }
      />

      <HeroMetrics metrics={metrics} stealthMode={stealthMode} onToggleStealth={() => setStealthMode(!stealthMode)} />

      <PerformanceChart assets={assets} stealthMode={stealthMode} />

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 xl:col-span-4">
          <AllocationDonut assets={assets} stealthMode={stealthMode} />
        </div>
        <div className="col-span-12 xl:col-span-8">
          <VaultAssetsList
            assets={assets}
            stealthMode={stealthMode}
            onLogSnapshot={() => {
              // Future wiring: You can pass the specific asset ID into the modal
              // state here so it auto-selects when clicking a specific asset!
              setIsModalOpen(true);
            }}
          />
        </div>
      </div>

      <SnapshotHistoryTable assets={assets} stealthMode={stealthMode} />

      <LogSnapshotModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} assets={assets} />
    </div>
  );
}
