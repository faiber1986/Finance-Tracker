"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CategoryDialog } from "./CategoryDialog";
import { deleteCategoryAction } from "@/features/categories/actions/category.actions";
import type { CategoryOut } from "@/features/categories/types/category.types";

interface Props {
  category: CategoryOut;
  onRefresh: () => void;
}

export function CategoryCard({ category, onRefresh }: Props) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteCategoryAction(category.id);
    setDeleting(false);
    if (result.error) toast.error("Failed to delete category");
    else {
      toast.success("Category deleted");
      onRefresh();
    }
  }

  return (
    <Card className="relative group">
      <CardContent className="p-4 flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0"
          style={{ backgroundColor: category.color }}
        >
          {category.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{category.name}</p>
          <Badge
            variant={category.transaction_type === "income" ? "success" : "destructive"}
            className="mt-1 capitalize text-xs"
          >
            {category.transaction_type}
          </Badge>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <CategoryDialog
            category={category}
            onSuccess={onRefresh}
            trigger={
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            }
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete &quot;{category.name}&quot;?</AlertDialogTitle>
                <AlertDialogDescription>
                  Transactions linked to this category will lose their category assignment.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
