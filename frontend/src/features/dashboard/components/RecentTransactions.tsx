import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Activity } from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  transaction_type: "income" | "expense";
  description: string | null;
  date: string;
  category: { name: string; color: string; icon: string } | null;
}

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">Latest financial activity</p>
        </div>
        <Link
          href="/transactions"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">No transactions yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add your first transaction to get started
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xs text-white font-bold shrink-0 shadow-sm"
                    style={{ backgroundColor: tx.category?.color ?? "#6366f1" }}
                  >
                    {(tx.category?.name ?? "T").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">
                      {tx.description ?? tx.category?.name ?? "Transaction"}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {tx.transaction_type === "income" ? (
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      tx.transaction_type === "income"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    )}
                  >
                    {tx.transaction_type === "income" ? "+" : "−"}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
