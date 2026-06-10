"use client";

import { useState, useEffect } from "react";
import { apiFetchBrowser } from "@/lib/api-client-browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TransactionDialog } from "./TransactionDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction, TransactionListResponse } from "@/features/transactions/types/transaction.types";
import type { CategoryOut } from "@/features/categories/types/category.types";

const ALL = "all";

interface Props {
  initialData: TransactionListResponse;
  categories: CategoryOut[];
}

export function TransactionTable({ initialData, categories }: Props) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    category_id: ALL,
    transaction_type: ALL,
  });

  function buildParams(f: typeof filters) {
    const params = new URLSearchParams();
    if (f.start_date) params.set("start_date", f.start_date);
    if (f.end_date) params.set("end_date", f.end_date);
    if (f.category_id && f.category_id !== ALL) params.set("category_id", f.category_id);
    if (f.transaction_type && f.transaction_type !== ALL) params.set("transaction_type", f.transaction_type);
    params.set("limit", "50");
    return params;
  }

  async function fetchFiltered(newFilters: typeof filters) {
    setLoading(true);
    try {
      const params = buildParams(newFilters).toString();
      const result = await apiFetchBrowser<TransactionListResponse>(
        `/api/proxy/transactions?${params}`
      );
      setData(result);
    } catch {
      toast.error("Could not load transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    await fetchFiltered(filters);
  }

  function handleFilterChange(key: keyof typeof filters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    const empty = { start_date: "", end_date: "", category_id: ALL, transaction_type: ALL };
    setFilters(empty);
    fetchFiltered(empty);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
        <TransactionDialog
          categories={categories}
          onSuccess={handleRefresh}
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Transaction
            </Button>
          }
        />
      </div>

      <div className="flex flex-wrap gap-3 p-4 bg-card rounded-lg border border-border">
        <Input
          type="date"
          value={filters.start_date}
          onChange={(e) => handleFilterChange("start_date", e.target.value)}
          className="w-40"
        />
        <Input
          type="date"
          value={filters.end_date}
          onChange={(e) => handleFilterChange("end_date", e.target.value)}
          className="w-40"
        />
        <Select value={filters.transaction_type} onValueChange={(v) => handleFilterChange("transaction_type", v)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.category_id} onValueChange={(v) => handleFilterChange("category_id", v)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => fetchFiltered(filters)} variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
        <Button onClick={clearFilters} variant="ghost" size="sm">Clear</Button>
      </div>

      <div className="bg-card rounded-lg border border-border">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : data.items.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No transactions found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(tx.date)}</TableCell>
                  <TableCell className="font-medium">{tx.description ?? "—"}</TableCell>
                  <TableCell>
                    {tx.category ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tx.category.color }} />
                        {tx.category.name}
                      </span>
                    ) : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={tx.transaction_type === "income" ? "success" : "destructive"} className="capitalize">
                      {tx.transaction_type}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${tx.transaction_type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                    {tx.transaction_type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <TransactionDialog
                        categories={categories}
                        transaction={tx}
                        onSuccess={handleRefresh}
                        trigger={
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DeleteConfirmDialog
                        transactionId={tx.id}
                        onSuccess={handleRefresh}
                        trigger={
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {data.total > 0 && (
          <div className="px-4 py-3 border-t text-sm text-muted-foreground">
            Showing {data.items.length} of {data.total} transactions
          </div>
        )}
      </div>
    </div>
  );
}
