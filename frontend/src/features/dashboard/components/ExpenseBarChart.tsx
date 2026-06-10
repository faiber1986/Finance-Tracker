"use client";

import { BarChart } from "@tremor/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategoryExpensePoint } from "@/features/dashboard/types/dashboard.types";
import { formatCurrency } from "@/lib/utils";
import { BarChart2 } from "lucide-react";

export function ExpenseBarChart({ data }: { data: CategoryExpensePoint[] }) {
  if (data.length === 0) {
    return (
      <Card className="border-border/60 shadow-sm h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Expenses by Category</CardTitle>
          <p className="text-xs text-muted-foreground">Breakdown of spending across categories</p>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-52 text-center">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">No expenses yet</p>
          <p className="text-xs text-muted-foreground mt-1">Create categories and add expenses</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Expenses by Category</CardTitle>
        <p className="text-xs text-muted-foreground">Breakdown of spending across categories</p>
      </CardHeader>
      <CardContent>
        <BarChart
          data={data}
          index="name"
          categories={["amount"]}
          colors={["indigo"]}
          valueFormatter={(v) => formatCurrency(v)}
          layout="vertical"
          className="h-72"
          showLegend={false}
          showGridLines
        />
      </CardContent>
    </Card>
  );
}
