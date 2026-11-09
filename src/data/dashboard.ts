import type {
  DateRange,
  RevenuePoint,
  SalesPoint,
  CustomerGrowthPoint,
  NamedValue,
  Kpi,
  ActivityItem,
} from "@/types/dashboard";

// Deterministic generation — anchored to a fixed reference date so server
// and client render identical data (no hydration mismatch).
const REFERENCE_DATE = new Date("2026-11-06T00:00:00Z");

function generateRevenueSeries(days: number): RevenuePoint[] {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(REFERENCE_DATE);
    date.setDate(date.getDate() - (days - 1 - i));
    const wave = Math.sin(i / 5) * 700;
    const noise = (((i * 9301 + 49297) % 233280) / 233280) * 500;
    const trend = i * 22;
    const dow = date.getUTCDay();
    const weekendFactor = dow === 0 || dow === 6 ? 0.65 : 1;
    const revenue = Math.round((4200 + wave + noise + trend) * weekendFactor);
    const expenses = Math.round((2100 + noise * 0.5 + trend * 0.4) * weekendFactor);
    return {
      date: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      revenue,
      expenses,
    };
  });
}

const ALL_DAYS = generateRevenueSeries(180);

function sliceForRange(range: DateRange): RevenuePoint[] {
  switch (range) {
    case "today":
      return ALL_DAYS.slice(-1);
    case "last7":
      return ALL_DAYS.slice(-7);
    case "last30":
      return ALL_DAYS.slice(-30);
    case "last90":
      return ALL_DAYS.slice(-90);
    case "thisYear":
      return ALL_DAYS;
  }
}

function previousSliceForRange(range: DateRange): RevenuePoint[] {
  switch (range) {
    case "today":
      return ALL_DAYS.slice(-2, -1);
    case "last7":
      return ALL_DAYS.slice(-14, -7);
    case "last30":
      return ALL_DAYS.slice(-60, -30);
    case "last90":
      return ALL_DAYS.slice(-180, -90);
    case "thisYear":
      return [];
  }
}

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export function getRevenueSeries(range: DateRange): RevenuePoint[] {
  return sliceForRange(range);
}

export function getSalesSeries(range: DateRange): SalesPoint[] {
  return sliceForRange(range).map((p) => ({
    date: p.date,
    label: p.label,
    sales: Math.round(p.revenue / 42),
  }));
}

export function getCustomerGrowthSeries(range: DateRange): CustomerGrowthPoint[] {
  const points = sliceForRange(range);
  let cumulative = 240;
  return points.map((p, i) => {
    const step = i === 0 ? 0 : Math.max(0, Math.round(((i * 7 + 3) % 11) / 3));
    cumulative += step;
    return { date: p.date, label: p.label, customers: cumulative };
  });
}

export function getDashboardKpis(range: DateRange): Kpi[] {
  const current = sliceForRange(range);
  const previous = previousSliceForRange(range);

  const sum = (series: RevenuePoint[], key: "revenue" | "expenses") =>
    series.reduce((s, p) => s + p[key], 0);

  const revenue = sum(current, "revenue");
  const prevRevenue = sum(previous, "revenue");
  const expenses = sum(current, "expenses");
  const prevExpenses = sum(previous, "expenses");
  const grossProfit = revenue - expenses;
  const prevGross = prevRevenue - prevExpenses;
  const salesCount = current.reduce(
    (s, p) => s + Math.round(p.revenue / 42),
    0
  );
  const prevSalesCount = previous.reduce(
    (s, p) => s + Math.round(p.revenue / 42),
    0
  );
  // Static KPIs — do not vary by range (would need ledger history per period).
  const outstandingInvoices = 12450;
  const inventoryValue = 68420;
  const lowStockCount = 7;

  const revenueChange = pctChange(revenue, prevRevenue);
  const expensesChange = pctChange(expenses, prevExpenses);
  const grossChange = pctChange(grossProfit, prevGross);
  const salesChange = pctChange(salesCount, prevSalesCount);
  const netProfit = grossProfit * 0.72;

  return [
    {
      key: "revenue",
      label: "Total revenue",
      value: revenue,
      format: "currency",
      change: revenueChange,
      trend: trendOf(revenueChange),
      positive: (revenueChange ?? 0) >= 0,
      hint: "Sum of all sales in the selected period.",
    },
    {
      key: "expenses",
      label: "Total expenses",
      value: expenses,
      format: "currency",
      change: expensesChange,
      trend: trendOf(expensesChange),
      positive: (expensesChange ?? 0) <= 0,
      hint: "Sum of all recorded expenses in the selected period.",
    },
    {
      key: "gross-profit",
      label: "Gross profit",
      value: grossProfit,
      format: "currency",
      change: grossChange,
      trend: trendOf(grossChange),
      positive: (grossChange ?? 0) >= 0,
      hint: "Revenue minus cost of goods sold.",
    },
    {
      key: "net-profit",
      label: "Net profit (estimate)",
      value: netProfit,
      format: "currency",
      change: grossChange === null ? null : grossChange * 0.9,
      trend: trendOf(grossChange === null ? null : grossChange * 0.9),
      positive: true,
      hint: "Management summary — not a certified financial statement.",
    },
    {
      key: "sales",
      label: "Total sales",
      value: salesCount,
      format: "number",
      change: salesChange,
      trend: trendOf(salesChange),
      positive: (salesChange ?? 0) >= 0,
      hint: "Number of completed transactions in the selected period.",
    },
    {
      key: "outstanding",
      label: "Outstanding invoices",
      value: outstandingInvoices,
      format: "currency",
      change: null,
      trend: "neutral",
      positive: false,
      hint: "Total unpaid invoice balance across all customers.",
    },
    {
      key: "inventory-value",
      label: "Inventory value",
      value: inventoryValue,
      format: "currency",
      change: null,
      trend: "neutral",
      positive: true,
      hint: "Estimated value of stock on hand at purchase price.",
    },
    {
      key: "low-stock",
      label: "Low-stock products",
      value: lowStockCount,
      format: "number",
      change: null,
      trend: "neutral",
      positive: false,
      hint: "Products at or below their reorder level.",
    },
  ];
}

function trendOf(change: number | null): "up" | "down" | "neutral" {
  if (change === null) return "neutral";
  if (change > 0.5) return "up";
  if (change < -0.5) return "down";
  return "neutral";
}

const CHART_COLORS = {
  accent: "#C6A66B",
  success: "#38B982",
  danger: "#E06B67",
  warning: "#E5A84B",
  info: "#68A9D8",
} as const;

export function getTopProducts(): NamedValue[] {
  return [
    { name: "Wireless keyboard", value: 128400 },
    { name: "Bluetooth speaker", value: 98200 },
    { name: "USB-C cable", value: 76150 },
    { name: "Mechanical mouse", value: 68400 },
    { name: "Webcam HD", value: 54120 },
    { name: "Power bank 20k", value: 42300 },
  ];
}

export function getPaymentMethods(): NamedValue[] {
  return [
    { name: "Card", value: 58, color: CHART_COLORS.accent },
    { name: "Cash", value: 22, color: CHART_COLORS.success },
    { name: "Bank transfer", value: 12, color: CHART_COLORS.info },
    { name: "Digital wallet", value: 8, color: CHART_COLORS.warning },
  ];
}

export function getInventoryStatus(): NamedValue[] {
  return [
    { name: "In stock", value: 168, color: CHART_COLORS.success },
    { name: "Low stock", value: 7, color: CHART_COLORS.warning },
    { name: "Out of stock", value: 3, color: CHART_COLORS.danger },
  ];
}

export function getRecentActivity(): ActivityItem[] {
  return [
    {
      id: "a1",
      type: "sale",
      title: "Sale completed",
      description: "INV-1042 · Acme Ltd · Card",
      amount: 4250,
      time: "2 minutes ago",
    },
    {
      id: "a2",
      type: "invoice",
      title: "Invoice sent",
      description: "INV-1043 · Globex Inc",
      amount: 1890,
      time: "18 minutes ago",
    },
    {
      id: "a3",
      type: "stock",
      title: "Stock received",
      description: "Wireless keyboard · +50 units",
      time: "1 hour ago",
    },
    {
      id: "a4",
      type: "customer",
      title: "New customer added",
      description: "Initech · Sales@initech.example",
      time: "2 hours ago",
    },
    {
      id: "a5",
      type: "expense",
      title: "Expense recorded",
      description: "Utilities · Monthly electricity bill",
      amount: 320,
      time: "3 hours ago",
    },
    {
      id: "a6",
      type: "employee",
      title: "Employee checked in",
      description: "Amina K. · Sales · 08:54 AM",
      time: "5 hours ago",
    },
  ];
}