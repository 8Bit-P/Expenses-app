import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";
import { lazyWithRetry } from "../utils/lazyWithRetry";

// --- Lazy Load Pages for Production Performance ---
// These won't be bundled until the user navigates to the specific route
const Landing = lazyWithRetry(() => import("../pages/Landing"));
const Auth = lazyWithRetry(() => import("../pages/Auth"));
const Dashboard = lazyWithRetry(() => import("../pages/Dashboard"));
const Expenses = lazyWithRetry(() => import("../pages/Expenses"));
const Subscriptions = lazyWithRetry(() => import("../pages/Subscriptions"));
const Settings = lazyWithRetry(() => import("../pages/Settings"));
const Investments = lazyWithRetry(() => import("../pages/Investments"));
const SearchResults = lazyWithRetry(() => import("../pages/Search"));
const Privacy = lazyWithRetry(() => import("../pages/Legal/Privacy"));
const Terms = lazyWithRetry(() => import("../pages/Legal/Terms"));

// A clean, premium loading spinner that fits the Vault aesthetic
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* 1. Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        {/* 2. Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/assets" element={<Investments />} />
            <Route path="/recurring" element={<Subscriptions />} />
            <Route path="/search" element={<SearchResults />} />
          </Route>
        </Route>

        {/* 3. Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
