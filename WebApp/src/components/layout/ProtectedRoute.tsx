import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
  const { session, loading } = useAuth();
  const location = useLocation();

  // This prevents the "Navigate" below from firing too early.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2. Only redirect if we ARE NOT loading AND there is no session.
  // We save the 'location' so we can potentially send them back after they log in.
  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
}