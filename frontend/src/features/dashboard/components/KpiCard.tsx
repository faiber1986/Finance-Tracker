import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "income" | "expense" | "neutral";
}

const variantStyles = {
  default: {
    value: "text-foreground",
    icon: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    accent: "from-slate-400 dark:from-slate-500",
  },
  income: {
    value: "text-emerald-600 dark:text-emerald-400",
    icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
    accent: "from-emerald-500 dark:from-emerald-400",
  },
  expense: {
    value: "text-rose-600 dark:text-rose-400",
    icon: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400",
    accent: "from-rose-500 dark:from-rose-400",
  },
  neutral: {
    value: "text-indigo-600 dark:text-indigo-400",
    icon: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
    accent: "from-indigo-500 dark:from-indigo-400",
  },
};

export function KpiCard({ title, value, subtitle, icon: Icon, variant = "default" }: KpiCardProps) {
  const styles = variantStyles[variant];
  return (
    <Card className="relative overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className={cn("absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r to-transparent", styles.accent)} />
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground truncate">
              {title}
            </p>
            <p className={cn("text-2xl font-bold tracking-tight truncate", styles.value)}>{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={cn("p-2.5 rounded-xl shrink-0 mt-0.5", styles.icon)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
