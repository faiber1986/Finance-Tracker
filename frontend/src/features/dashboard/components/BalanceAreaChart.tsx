"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BalanceHistoryPoint } from "@/features/dashboard/types/dashboard.types";
import { TrendingUp } from "lucide-react";

const SERIES_COLORS = {
  income: "#10b981",
  expenses: "#f43f5e",
  balance: "#818cf8",
};

function yAxisFormatter(v: number): string {
  if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(1)}k`;
  return `$${v.toFixed(0)}`;
}

function tooltipFormatter(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function BalanceAreaChart({ data }: { data: BalanceHistoryPoint[] }) {
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
      <CardContent className="pr-2">
        <ResponsiveContainer width="100%" height={288}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              {(["income", "expenses", "balance"] as const).map((key) => (
                <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={SERIES_COLORS[key]} stopOpacity={dark ? 0.35 : 0.25} />
                  <stop offset="95%" stopColor={SERIES_COLORS[key]} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />

            <XAxis
              dataKey="month"
              tick={{ fill: axisColor, fontSize: 11 }}
              axisLine={{ stroke: gridColor }}
              tickLine={false}
              dy={4}
            />
            <YAxis
              tickFormatter={yAxisFormatter}
              tick={{ fill: axisColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={52}
            />

            <Tooltip
              formatter={(value: number, name: string) => [tooltipFormatter(value), capitalize(name)]}
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: "8px",
                color: tooltipText,
                fontSize: "12px",
              }}
              labelStyle={{ color: tooltipText, fontWeight: 600, marginBottom: 4 }}
            />

            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ color: axisColor, fontSize: "12px" }}>{capitalize(value)}</span>
              )}
            />

            {(["income", "expenses", "balance"] as const).map((key) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={SERIES_COLORS[key]}
                strokeWidth={2}
                fill={`url(#grad-${key})`}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: SERIES_COLORS[key] }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
