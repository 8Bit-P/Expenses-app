import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { UserPreferencesProvider } from "./context/UserPreferencesContext";
import AppRouter from "./routes/AppRouter";

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
          </UserPreferencesProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
