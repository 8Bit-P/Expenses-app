import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";

// --- Lazy Load Pages for Production Performance ---
// These won't be bundled until the user navigates to the specific route
const Auth = lazy(() => import("../pages/Auth"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Expenses = lazy(() => import("../pages/Expenses"));
const Settings = lazy(() => import("../pages/Settings"));

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
        {/* 1. Public Route */}
        <Route path="/auth" element={<Auth />} />

        {/* 2. Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/settings" element={<Settings />} />

            {/* Placeholder Routes */}
            <Route
              path="/investments"
              element={
                <div className="flex items-center justify-center h-64 text-on-surface-variant font-headline font-bold">
                  Investments Page Coming Soon
                </div>
              }
            />

            <Route
              path="/subscriptions"
              element={
                <div className="flex items-center justify-center h-64 text-on-surface-variant font-headline font-bold">
                  Subscriptions Page Coming Soon
                </div>
              }
            />
          </Route>
        </Route>

        {/* 3. Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
