import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The AppLayout acts as the shell (Sidebar, Topbar, etc.) */}
        <Route element={<AppLayout />}>
          
          {/* Main Dashboard Route */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Placeholder Routes for your other sections */}
          <Route path="/investments" element={
            <div className="flex items-center justify-center h-64 text-on-surface-variant font-headline font-bold">
              Investments Page Coming Soon
            </div>
          } />
          
          <Route path="/expenses" element={
            <div className="flex items-center justify-center h-64 text-on-surface-variant font-headline font-bold">
              Expenses Page Coming Soon
            </div>
          } />
          
          <Route path="/subscriptions" element={
            <div className="flex items-center justify-center h-64 text-on-surface-variant font-headline font-bold">
              Subscriptions Page Coming Soon
            </div>
          } />
          
          <Route path="/settings" element={
            <div className="flex items-center justify-center h-64 text-on-surface-variant font-headline font-bold">
              Settings Page Coming Soon
            </div>
          } />

          {/* Catch-all: If a user types a wrong URL, redirect them home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}