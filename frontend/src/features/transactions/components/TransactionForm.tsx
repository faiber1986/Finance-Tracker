"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTransactionAction, updateTransactionAction } from "@/features/transactions/actions/transaction.actions";
import type { Transaction } from "@/features/transactions/types/transaction.types";
import type { CategoryOut } from "@/features/categories/types/category.types";

interface Props {
  categories: CategoryOut[];
  transaction?: Transaction;
  onSuccess: () => void;
}

export function TransactionForm({ categories, transaction, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"income" | "expense">(transaction?.transaction_type ?? "expense");

  const filteredCategories = categories.filter((c) => c.transaction_type === type);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      amount: parseFloat(fd.get("amount") as string),
      transaction_type: type,
      description: (fd.get("description") as string) || undefined,
      date: fd.get("date") as string,
      category_id: (fd.get("category_id") as string) || undefined,
    };

    const result = transaction
      ? await updateTransactionAction(transaction.id, payload)
      : await createTransactionAction(payload);

    setLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(transaction ? "Transaction updated" : "Transaction created");
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          defaultValue={transaction?.amount}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          defaultValue={transaction?.date ?? new Date().toISOString().split("T")[0]}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category_id">Category</Label>
        <Select name="category_id" defaultValue={transaction?.category?.id}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                <span className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: c.color }}
                  />
                  {c.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          placeholder="Optional note"
          defaultValue={transaction?.description ?? ""}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : transaction ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
