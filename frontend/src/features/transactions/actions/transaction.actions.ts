"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api-client";
import type { Transaction, TransactionListResponse } from "@/features/transactions/types/transaction.types";

export async function listTransactionsAction(
  params: string
): Promise<{ data?: TransactionListResponse; error?: string }> {
  try {
    const data = await apiFetch<TransactionListResponse>(`/api/v1/transactions?${params}`);
    return { data };
  } catch (e) {
    if (String(e).includes("UNAUTHORIZED")) return { error: "UNAUTHORIZED" };
    return { error: String(e) };
  }
}

export async function createTransactionAction(data: {
  amount: number;
  transaction_type: "income" | "expense";
  description?: string;
  date: string;
  category_id?: string;
}): Promise<{ data?: Transaction; error?: string }> {
  try {
    const tx = await apiFetch<Transaction>("/api/v1/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    });
    revalidatePath("/transactions");
    return { data: tx };
  } catch (e) {
    return { error: String(e) };
  }
}

export async function updateTransactionAction(
  id: string,
  data: Partial<{
    amount: number;
    transaction_type: "income" | "expense";
    description: string;
    date: string;
    category_id: string;
  }>
): Promise<{ data?: Transaction; error?: string }> {
  try {
    const tx = await apiFetch<Transaction>(`/api/v1/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    revalidatePath("/transactions");
    return { data: tx };
  } catch (e) {
    return { error: String(e) };
  }
}

export async function deleteTransactionAction(id: string): Promise<{ error?: string }> {
  try {
    await apiFetch(`/api/v1/transactions/${id}`, { method: "DELETE" });
    revalidatePath("/transactions");
    return {};
  } catch (e) {
    return { error: String(e) };
  }
}
