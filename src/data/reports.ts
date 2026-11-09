import type {
  SalesPoint, CategorySale, InventoryValuation, CustomerGrowthPoint, ReportRange
} from "@/types/reports";

const REFERENCE_DATE = new Date("2026-11-06T00:00:00Z");

// Deterministic pseudo-random generator for consistent charts
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const ALL_SALES: SalesPoint[] = Array.from({ length: 365 }, (_, i) => {
  const date = new Date(REFERENCE_DATE);
  date.setDate(date.getDate() - (365 - 1 - i));
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const base = isWeekend ? 1200 : 2800;
  const noise = seededRandom(i) * 800;
  const trend = i * 2;
  const revenue = Math.round(base + noise + trend);
  return {
    date: date.toISOString().slice(0, 10),
    revenue,
    orders: Math.round(revenue / 45),
  };
});

export function getSalesData(range: ReportRange): SalesPoint[] {
  switch (range) {
    case "today": return ALL_SALES.slice(-1);
    case "last7": return ALL_SALES.slice(-7);
    case "last30": return ALL_SALES.slice(-30);
    case "last90": return ALL_SALES.slice(-90);
    case "thisYear": return ALL_SALES;
  }
}

export function getSalesByCategory(): CategorySale[] {
  return [
    { name: "Electronics", value: 45000 },
    { name: "Accessories", value: 28000 },
    { name: "Audio", value: 18000 },
    { name: "Office", value: 12000 },
    { name: "Home", value: 8000 },
    { name: "Clothing", value: 5000 },
  ];
}

export function getInventoryValuation(): InventoryValuation[] {
  return [
    { name: "Electronics", value: 32000 },
    { name: "Accessories", value: 15000 },
    { name: "Audio", value: 12000 },
    { name: "Office", value: 6400 },
    { name: "Home", value: 3000 },
  ];
}

export function getCustomerGrowthData(range: ReportRange): CustomerGrowthPoint[] {
  const days = range === "today" ? 1 : range === "last7" ? 7 : range === "last30" ? 30 : range === "last90" ? 90 : 365;
  const points: CustomerGrowthPoint[] = [];
  let total = 240; // starting baseline
  
  for (let i = 0; i < days; i += (days > 90 ? 7 : 1)) {
    const date = new Date(REFERENCE_DATE);
    date.setDate(date.getDate() - (days - 1 - i));
    const newCustomers = Math.max(0, Math.round(seededRandom(i) * 5 - 1));
    total += newCustomers;
    points.push({
      date: date.toISOString().slice(0, 10),
      newCustomers,
      totalCustomers: total,
    });
  }
  return points;
}

// Financial Mock Data (re-using from finance module concept)
export function getFinancialSummary(range: ReportRange) {
  const data = getSalesData(range);
  const revenue = data.reduce((s, d) => s + d.revenue, 0);
  const cogs = revenue * 0.35;
  const grossProfit = revenue - cogs;
  const expenses = revenue * 0.25; // mock 25% op ex
  const netProfit = grossProfit - expenses;
  return { revenue, cogs, grossProfit, expenses, netProfit };
}