import type { CategoryOut } from "@/features/categories/types/category.types";

export interface Transaction {
  id: string;
  amount: number;
  transaction_type: "income" | "expense";
  description: string | null;
  date: string;
  category: CategoryOut | null;
  created_at: string;
}

export interface TransactionListResponse {
  items: Transaction[];
  total: number;
}

export interface TransactionFilters {
  start_date?: string;
  end_date?: string;
  category_id?: string;
  transaction_type?: "income" | "expense" | "";
}
