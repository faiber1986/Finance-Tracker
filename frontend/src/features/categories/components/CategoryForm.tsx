"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createCategoryAction, updateCategoryAction } from "@/features/categories/actions/category.actions";
import type { CategoryOut } from "@/features/categories/types/category.types";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444", "#f97316",
  "#f59e0b", "#10b981", "#14b8a6", "#0ea5e9", "#3b82f6",
  "#64748b", "#78716c",
];

const PRESET_ICONS = [
  "ShoppingCart", "Home", "Car", "Utensils", "Heart", "Book",
  "Briefcase", "Coffee", "Music", "Plane", "Gift", "Zap",
  "TrendingUp", "DollarSign", "CreditCard", "PiggyBank",
];

interface Props {
  category?: CategoryOut;
  onSuccess: () => void;
}

export function CategoryForm({ category, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState(category?.color ?? PRESET_COLORS[0]);
  const [icon, setIcon] = useState(category?.icon ?? PRESET_ICONS[0]);
  const [type, setType] = useState<"income" | "expense">(category?.transaction_type ?? "expense");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name") as string,
      color,
      icon,
      transaction_type: type,
    };

    const result = category
      ? await updateCategoryAction(category.id, payload)
      : await createCategoryAction(payload);

    setLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(category ? "Category updated" : "Category created");
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="e.g. Groceries" defaultValue={category?.name} required />
      </div>

      <div className="space-y-2">
        <Label>Type</Label>
        <div className="flex gap-2">
          {(["income", "expense"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium border transition-colors capitalize ${
                type === t
                  ? t === "income"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-rose-600 text-white border-rose-600"
                  : "bg-background border-input hover:bg-accent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={cn(
                "w-7 h-7 rounded-full border-2 transition-transform hover:scale-110",
                color === c ? "border-slate-900 scale-110" : "border-transparent"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Icon</Label>
        <div className="grid grid-cols-8 gap-1">
          {PRESET_ICONS.map((ic) => (
            <button
              key={ic}
              type="button"
              onClick={() => setIcon(ic)}
              title={ic}
              className={cn(
                "p-1.5 rounded text-xs text-center border transition-colors",
                icon === ic ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent"
              )}
            >
              {ic.slice(0, 2)}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Selected: {icon}</p>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : category ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
