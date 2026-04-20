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
    },
  });

  const { mutateAsync: deleteCategory } = useMutation({
    mutationFn: async (categoryId: string) => {
      if (!userId) throw new Error("Authentication required to delete category");

      // Check if an "Unknown" or "Uncategorized" category already exists
      let { data: unknownCat } = await supabase
        .from("categories")
        .select("id")
        .eq("user_id", userId)
        .ilike("name", "Unknown") // Case-insensitive search
        .maybeSingle(); // Use maybeSingle to avoid errors if it returns 0 rows

      let unknownCatId = unknownCat?.id;

      // If it doesn't exist, generate it silently
      if (!unknownCatId) {
        const { data: newCat, error: createError } = await supabase
          .from("categories")
          .insert([
            {
              user_id: userId,
              name: "Unknown",
              emoji: "❓",
              description: "System category for reassigned movements",
            },
          ])
          .select("id")
          .single();

        if (createError) throw new Error("Failed to generate fallback category.");
        unknownCatId = newCat.id;
      }

      // Safeguard: Prevent the user from deleting the Unknown category itself
      if (categoryId === unknownCatId) {
        throw new Error("You cannot delete the master Unknown category.");
      }

      // 3. Move all Transactions to the Unknown category
      const { error: txError } = await supabase
        .from("transactions")
        .update({ category_id: unknownCatId })
        .eq("category_id", categoryId);

      if (txError) throw new Error("Failed to reassign transactions.");

      // Move all Subscriptions to the Unknown category
      const { error: subError } = await supabase
        .from("subscriptions")
        .update({ category_id: unknownCatId })
        .eq("category_id", categoryId);

      if (subError) throw new Error("Failed to reassign subscriptions.");

      // Now that the dependencies are cleared, safely delete the category
      const { error: deleteError } = await supabase.from("categories").delete().eq("id", categoryId);

      if (deleteError) throw new Error(deleteError.message);
    },
    onSuccess: () => {
      // Invalidate both categories and transactions so the UI updates instantly!
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });

  return { categories, loading: isLoading, error, addCategory, deleteCategory };
}
