export type TransactionType = "expense" | "income";

export interface Category {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  emoji: string | null;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string | null;
  created_at: string;
  // Joined fields
  category?: Category;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  type?: TransactionType;
  search?: string;
  page?: number;
  pageSize?: number;
}
