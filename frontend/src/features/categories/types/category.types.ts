export interface CategoryOut {
  id: string;
  name: string;
  color: string;
  icon: string;
  transaction_type: "income" | "expense";
  created_at: string;
}
