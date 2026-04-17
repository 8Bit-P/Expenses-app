import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import Expenses from "./pages/Expenses";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth"; // Your new auth screen
import { AuthProvider } from "./context/AuthContext";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* 1. Public Route (No Layout, No Auth Required) */}
          <Route path="/auth" element={<Auth />} />

          {/* 2. Protected Routes (Wrapped in ProtectedRoute and AppLayout) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              
              <Route path="/" element={<Dashboard />} />
              <Route path="/expenses" element={<Expenses />} />
              
              {/* Placeholder Routes */}
              <Route path="/investments" element={
                <div className="flex items-center justify-center h-64 text-on-surface-variant font-headline font-bold">
                  Investments Page Coming Soon
                </div>
              } />
              
              <Route path="/subscriptions" element={
                <div className="flex items-center justify-center h-64 text-on-surface-variant font-headline font-bold">
                  Subscriptions Page Coming Soon
                </div>
              } />
              
              <Route path="/settings" element={<Settings/>} />

            </Route>
          </Route>

          {/* 3. Catch-all: If a user types a wrong URL, redirect them home */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}