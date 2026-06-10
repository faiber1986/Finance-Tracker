"use server";

import { apiFetch } from "@/lib/api-client";
import type { CategoryOut } from "@/features/categories/types/category.types";

export async function createCategoryAction(data: {
  name: string;
  color: string;
  icon: string;
  transaction_type: "income" | "expense";
}): Promise<{ data?: CategoryOut; error?: string }> {
  try {
    const cat = await apiFetch<CategoryOut>("/api/v1/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return { data: cat };
  } catch (e) {
    return { error: String(e) };
  }
}

export async function updateCategoryAction(
  id: string,
  data: Partial<{ name: string; color: string; icon: string; transaction_type: "income" | "expense" }>
): Promise<{ data?: CategoryOut; error?: string }> {
  try {
    const cat = await apiFetch<CategoryOut>(`/api/v1/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return { data: cat };
  } catch (e) {
    return { error: String(e) };
  }
}

export async function deleteCategoryAction(id: string): Promise<{ error?: string }> {
  try {
    await apiFetch(`/api/v1/categories/${id}`, { method: "DELETE" });
    return {};
  } catch (e) {
    return { error: String(e) };
  }
}

export async function seedDefaultCategoriesAction(): Promise<{ error?: string }> {
  try {
    await apiFetch("/api/v1/categories/seed-defaults", { method: "POST" });
    return {};
  } catch (e) {
    return { error: String(e) };
  }
}
