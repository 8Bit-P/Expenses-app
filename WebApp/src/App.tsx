import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { UserPreferencesProvider } from "./context/UserPreferencesContext";
import AppRouter from "./routes/AppRouter";
import { Toaster } from "sonner";

// Configure TanStack Query for a production environment
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
      retry: 1, // Only retry failed requests once to avoid spamming Supabase
      refetchOnWindowFocus: false, // Stop refetching every time the user switches browser tabs
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <UserPreferencesProvider>
            {/* All routing logic is securely isolated here */}
            <AppRouter />
            <Toaster
              position="bottom-right"
              expand={false}
              toastOptions={{
                className:
                  "bg-surface-container-lowest/95 backdrop-blur-xl border border-outline-variant/20 text-on-surface rounded-2xl shadow-2xl font-semibold tracking-tight",
                classNames: {
                  success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
                  error: "border-error/20 bg-error/10 text-error",
                  info: "border-primary/20 bg-primary/10 text-primary",
                  warning: "border-orange-500/20 bg-orange-500/10 text-orange-400",
                  title: "text-sm font-black",
                  description: "text-xs font-medium opacity-80",
                  actionButton: "bg-primary text-on-primary font-bold rounded-lg",
                },
              }}
            />
          </UserPreferencesProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
