export interface Summary {
  total_income: number;
  total_expenses: number;
  net_balance: number;
  transaction_count: number;
}

export interface BalanceHistoryPoint {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface CategoryExpensePoint {
  name: string;
  amount: number;
  color: string;
}

export interface MonthlyComparisonPoint {
  month: string;
  income: number;
  expenses: number;
}
