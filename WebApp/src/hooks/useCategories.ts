import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import type { Category } from "../types/expenses";

export function useCategories() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

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

  const { mutateAsync: addCategory } = useMutation({
    mutationFn: async (categoryData: Partial<Category>) => {
      if (!userId) throw new Error("Authentication required to add category");

      const { data, error } = await supabase
        .from("categories")
        .insert([{ ...categoryData, user_id: userId }])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data as Category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  });

  return { categories, loading: isLoading, error, addCategory };
}
