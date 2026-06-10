import { apiFetch } from "@/lib/api-client";
import { CategoryGrid } from "@/features/categories";
import type { CategoryOut } from "@/features/categories/types/category.types";

export default async function CategoriesPage() {
  const categories = await apiFetch<CategoryOut[]>("/api/v1/categories").catch(() => []);
  return <CategoryGrid categories={categories} />;
}
