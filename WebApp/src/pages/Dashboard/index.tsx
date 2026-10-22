import SummaryRow from "./components/SummaryRow";
import WealthEvolution from "./components/WealthEvolution";
import ActionCenter from "./components/ActionCenter";
import SpendingCategories from "./components/SpendingCategories";
import RecentActivity from "./components/RecentActivity";
import AccountsWidget from "./components/AccountsWidget";
import UpcomingRenewals from "./components/UpcomingRenewals";
import ReviewWidget from "./components/ReviewWidget";
import WelcomeEmptyState from "./components/WelcomeEmptyState";
import PageHeader from "../../components/ui/PageHeader";
import { useTransactions } from "../../hooks/useTransactions";
import { useInvestments } from "../../hooks/useInvestments";
import { useProfile } from "../../hooks/useProfile";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { profile } = useProfile();

  // We only fetch pageSize: 1 to minimize payload, we just need totalCount
  const { totalCount, loading: txLoading } = useTransactions({ needsReview: null, pageSize: 1 });
  const { assets, isLoading: invLoading } = useInvestments();

  const handleManualAdd = () => {
    window.dispatchEvent(new CustomEvent("open-new-transaction"));
  };

  const hour = new Date().getHours();
  let greetingKey = "layout.greetings.morning";
  if (hour >= 12 && hour < 18) greetingKey = "layout.greetings.afternoon";
  if (hour >= 18) greetingKey = "layout.greetings.evening";
  const firstName = profile?.full_name?.split(" ")[0] || t("layout.user");
  const today = new Intl.DateTimeFormat(i18n.language, { weekday: "long", day: "numeric", month: "long" }).format(
    new Date(),
  );

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        eyebrow={
          <>
            {t(greetingKey)}, {firstName}
            <span className="mx-1.5 text-outline">·</span>
            {today}
          </>
        }
        title={t("dashboard.title")}
        description={t("dashboard.subtitle")}
        actions={
          <button
            disabled
            className="hidden md:inline-flex h-9 px-3.5 items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm font-medium text-on-surface-variant cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            {t("dashboard.exportReport")}
            <span className="inline-flex items-center h-5 px-1.5 rounded bg-surface-container text-[11px] font-medium">
              {t("auth.soon")}
            </span>
          </button>
        }
      />

      {/* Review Inbox (Top Priority) */}
      <ReviewWidget />

      {!txLoading && !invLoading && totalCount === 0 && assets.length === 0 ? (
        <WelcomeEmptyState onAddManual={handleManualAdd} />
      ) : (
        <>
          <SummaryRow />

          <ActionCenter />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div className="lg:col-span-8 min-w-0">
              <WealthEvolution />
            </div>
            <div className="lg:col-span-4 min-w-0">
              <SpendingCategories />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-start">
            <RecentActivity />
            <AccountsWidget />
            <UpcomingRenewals />
          </div>
        </>
      )}
    </div>
  );
}
