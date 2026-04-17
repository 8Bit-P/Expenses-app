import { createContext, useContext, useEffect, useState } from "react";
import { type Session, type AuthChangeEvent } from "@supabase/supabase-js"; // Added AuthChangeEvent
import { supabase } from "../lib/supabase";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ session: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the current session on load
    supabase.auth.getSession().then(({ }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for login/logout events (Explicitly typing _event and session here)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);