"use client";

import { AreaChart } from "@tremor/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BalanceHistoryPoint } from "@/features/dashboard/types/dashboard.types";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

export function BalanceAreaChart({ data }: { data: BalanceHistoryPoint[] }) {
  if (data.length === 0) {
    return (
      <Card className="border-border/60 shadow-sm h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Balance History</CardTitle>
          <p className="text-xs text-muted-foreground">Income, expenses, and net balance over time</p>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-52 text-center">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">No data yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add transactions to see your balance history</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Balance History</CardTitle>
        <p className="text-xs text-muted-foreground">Income, expenses, and net balance over time</p>
      </CardHeader>
      <CardContent>
        <AreaChart
          data={data}
          index="month"
          categories={["income", "expenses", "balance"]}
          colors={["emerald", "rose", "indigo"]}
          valueFormatter={(v) => formatCurrency(v)}
          className="h-72"
          showLegend
          showGridLines
          curveType="monotone"
        />
      </CardContent>
    </Card>
  );
}
