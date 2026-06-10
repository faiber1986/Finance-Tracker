import { ArrowDownCircle, ArrowUpCircle, DollarSign, Hash } from "lucide-react";
import { apiFetch } from "@/lib/api-client";
import {
  KpiCard,
  BalanceAreaChart,
  ExpenseBarChart,
  RecentTransactions,
  type Summary,
  type BalanceHistoryPoint,
  type CategoryExpensePoint,
} from "@/features/dashboard";
import { formatCurrency } from "@/lib/utils";
import type { TransactionListResponse } from "@/features/transactions/types/transaction.types";

export default async function DashboardPage() {
  const [summary, balanceHistory, expensesByCategory, recentTxs] = await Promise.all([
    apiFetch<Summary>("/api/v1/analytics/summary").catch(() => ({
      total_income: 0, total_expenses: 0, net_balance: 0, transaction_count: 0,
    })),
    apiFetch<BalanceHistoryPoint[]>("/api/v1/analytics/balance-history").catch(() => []),
    apiFetch<CategoryExpensePoint[]>("/api/v1/analytics/expenses-by-category").catch(() => []),
    apiFetch<TransactionListResponse>("/api/v1/transactions?limit=5").catch(() => ({ items: [], total: 0 })),
  ]);

  const currentPeriod = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Financial Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete summary of your financial activity
          </p>
        </div>
        <div className="hidden sm:flex flex-col items-end shrink-0">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Period</span>
          <span className="text-sm font-semibold text-foreground mt-0.5">{currentPeriod}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Income"
          value={formatCurrency(summary.total_income)}
          icon={ArrowUpCircle}
          variant="income"
          subtitle="This month"
        />
        <KpiCard
          title="Total Expenses"
          value={formatCurrency(summary.total_expenses)}
          icon={ArrowDownCircle}
          variant="expense"
          subtitle="This month"
        />
        <KpiCard
          title="Net Balance"
          value={formatCurrency(summary.net_balance)}
          icon={DollarSign}
          variant={summary.net_balance >= 0 ? "income" : "expense"}
          subtitle="Income − Expenses"
        />
        <KpiCard
          title="Transactions"
          value={String(summary.transaction_count)}
          icon={Hash}
          variant="neutral"
          subtitle="This month"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <BalanceAreaChart data={balanceHistory} />
        </div>
        <div className="lg:col-span-2">
          <ExpenseBarChart data={expensesByCategory} />
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={recentTxs.items as any} />
    </div>
  );
}
