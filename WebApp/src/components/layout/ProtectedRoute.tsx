import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
  const { session, loading } = useAuth();

  // Show a blank screen or a subtle loading spinner while Supabase checks the token
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If there is no active session, redirect to the Auth page
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // If they are logged in, render the child routes (which will be your AppLayout)
  return <Outlet />;
}