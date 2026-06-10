"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CategoryForm } from "./CategoryForm";
import type { CategoryOut } from "@/features/categories/types/category.types";

interface Props {
  category?: CategoryOut;
  trigger: React.ReactNode;
  onSuccess?: () => void;
}

export function CategoryDialog({ category, trigger, onSuccess }: Props) {
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
          <DialogTitle>{category ? "Edit Category" : "New Category"}</DialogTitle>
        </DialogHeader>
        <CategoryForm category={category} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
