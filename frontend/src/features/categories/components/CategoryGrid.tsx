"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { CategoryCard } from "./CategoryCard";
import { CategoryDialog } from "./CategoryDialog";
import { seedDefaultCategoriesAction } from "@/features/categories/actions/category.actions";
import type { CategoryOut } from "@/features/categories/types/category.types";

export function CategoryGrid({ categories: initialCategories }: { categories: CategoryOut[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [seeding, setSeeding] = useState(false);

  // Sync when server revalidates
  useEffect(() => { setCategories(initialCategories); }, [initialCategories]);

  function handleRefresh() {
    router.refresh();
  }

  async function handleSeedDefaults() {
    setSeeding(true);
    const result = await seedDefaultCategoriesAction();
    setSeeding(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Categorías por defecto importadas");
      router.refresh();
    }
  }

  const income = categories.filter((c) => c.transaction_type === "income");
  const expense = categories.filter((c) => c.transaction_type === "expense");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSeedDefaults} disabled={seeding}>
            <Sparkles className="h-4 w-4 mr-2" />
            {seeding ? "Importando..." : "Importar por defecto"}
          </Button>
          <CategoryDialog
            onSuccess={handleRefresh}
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Category
              </Button>
            }
          />
        </div>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-3">Income</h2>
        {income.length === 0 ? (
          <p className="text-sm text-muted-foreground">No income categories yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {income.map((c) => <CategoryCard key={c.id} category={c} onRefresh={handleRefresh} />)}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-rose-700 uppercase tracking-wider mb-3">Expenses</h2>
        {expense.length === 0 ? (
          <p className="text-sm text-muted-foreground">No expense categories yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {expense.map((c) => <CategoryCard key={c.id} category={c} onRefresh={handleRefresh} />)}
          </div>
        )}
      </section>
    </div>
  );
}
