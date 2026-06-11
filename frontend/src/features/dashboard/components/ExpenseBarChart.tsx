"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategoryExpensePoint } from "@/features/dashboard/types/dashboard.types";
import { BarChart2 } from "lucide-react";

function xAxisFormatter(v: number): string {
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
  return `$${v.toFixed(0)}`;
}

function tooltipFormatter(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

const FALLBACK_COLORS = [
  "#6366f1", "#10b981", "#f43f5e", "#f59e0b",
  "#3b82f6", "#8b5cf6", "#06b6d4", "#ec4899",
];

export function ExpenseBarChart({ data }: { data: CategoryExpensePoint[] }) {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  const axisColor = dark ? "#94a3b8" : "#64748b";
  const gridColor = dark ? "rgba(148,163,184,0.12)" : "rgba(100,116,139,0.12)";
  const tooltipBg = dark ? "#0f172a" : "#ffffff";
  const tooltipBorder = dark ? "#1e293b" : "#e2e8f0";
  const tooltipText = dark ? "#f1f5f9" : "#0f172a";

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

  const maxLabelLength = Math.max(...data.map((d) => d.name.length));
  const yAxisWidth = Math.min(Math.max(maxLabelLength * 7, 72), 120);

  return (
    <Card className="border-border/60 shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Expenses by Category</CardTitle>
        <p className="text-xs text-muted-foreground">Breakdown of spending across categories</p>
      </CardHeader>
      <CardContent className="pr-2">
        <ResponsiveContainer width="100%" height={288}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />

            <XAxis
              type="number"
              tickFormatter={xAxisFormatter}
              tick={{ fill: axisColor, fontSize: 11 }}
              axisLine={{ stroke: gridColor }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: axisColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={yAxisWidth}
            />

            <Tooltip
              formatter={(value: number) => [tooltipFormatter(value), "Amount"]}
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: "8px",
                color: tooltipText,
                fontSize: "12px",
              }}
              labelStyle={{ color: tooltipText, fontWeight: 600, marginBottom: 4 }}
              cursor={{ fill: dark ? "rgba(148,163,184,0.08)" : "rgba(100,116,139,0.08)" }}
            />

            <Bar dataKey="amount" radius={[0, 4, 4, 0]} maxBarSize={28}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                  fillOpacity={dark ? 0.85 : 0.9}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
