export type DateRange = "today" | "last7" | "last30" | "last90" | "thisYear";

export interface RevenuePoint {
  date: string;
  label: string;
  revenue: number;
  expenses: number;
}

export interface SalesPoint {
  date: string;
  label: string;
  sales: number;
}

export interface CustomerGrowthPoint {
  date: string;
  label: string;
  customers: number;
}

export interface NamedValue {
  name: string;
  value: number;
  color?: string;
}

export interface Kpi {
  key: string;
  label: string;
  value: number;
  format: "currency" | "number";
  change: number | null;
  trend: "up" | "down" | "neutral";
  positive: boolean;
  hint: string;
}

export type ActivityType =
  | "sale"
  | "expense"
  | "customer"
  | "stock"
  | "invoice"
  | "employee";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  amount?: number;
  time: string;
}