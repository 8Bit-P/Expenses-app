import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import type { Category } from "../types/expenses";

export function useCategories() {
  const { session } = useAuth();
  const userId = session?.user?.id;

  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").eq("user_id", userId).order("name");

      if (error) throw new Error(error.message);
      return data as Category[];
    },
    // Only run the query if we actually have a user ID
    enabled: !!userId,
  });

  return { categories, loading: isLoading, error };
}
