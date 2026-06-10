import { apiFetch } from "@/lib/api-client";
import { TransactionTable } from "@/features/transactions";
import type { TransactionListResponse } from "@/features/transactions/types/transaction.types";
import type { CategoryOut } from "@/features/categories/types/category.types";

export default async function TransactionsPage() {
  const [initialData, categories] = await Promise.all([
    apiFetch<TransactionListResponse>("/api/v1/transactions?limit=50").catch(() => ({ items: [], total: 0 })),
    apiFetch<CategoryOut[]>("/api/v1/categories").catch(() => []),
  ]);

  return <TransactionTable initialData={initialData} categories={categories} />;
}
