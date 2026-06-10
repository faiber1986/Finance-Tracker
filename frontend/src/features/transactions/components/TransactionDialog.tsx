"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TransactionForm } from "./TransactionForm";
import type { Transaction } from "@/features/transactions/types/transaction.types";
import type { CategoryOut } from "@/features/categories/types/category.types";

interface Props {
  categories: CategoryOut[];
  transaction?: Transaction;
  trigger: React.ReactNode;
  onSuccess?: () => void;
}

export function TransactionDialog({ categories, transaction, trigger, onSuccess }: Props) {
  const [open, setOpen] = useState(false);

  function handleSuccess() {
    setOpen(false);
    onSuccess?.();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{transaction ? "Edit Transaction" : "New Transaction"}</DialogTitle>
        </DialogHeader>
        <TransactionForm
          categories={categories}
          transaction={transaction}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
