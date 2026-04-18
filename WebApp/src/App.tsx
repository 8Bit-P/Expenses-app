import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./context/AuthContext";
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
      <AuthProvider>
        <BrowserRouter>
          {/* All routing logic is securely isolated here */}
          <AppRouter />
        </BrowserRouter>
      </AuthProvider>

      {/* Devtools: These automatically hide in production builds, so it's safe to leave this line! */}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" position="bottom" />
    </QueryClientProvider>
  );
}
