export type ReportRange = "today" | "last7" | "last30" | "last90" | "thisYear";

export interface SalesPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface CategorySale {
  name: string;
  value: number;
}

export interface InventoryValuation {
  name: string;
  value: number;
}

export interface CustomerGrowthPoint {
  date: string;
  newCustomers: number;
  totalCustomers: number;
}

export const REPORT_LABELS: Record<ReportRange, string> = {
  today: "Today",
  last7: "Last 7 Days",
  last30: "Last 30 Days",
  last90: "Last 90 Days",
  thisYear: "This Year",
};