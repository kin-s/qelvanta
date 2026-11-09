"use client";

import { useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  Area, AreaChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { EXPENSE_CATEGORY_LABELS, type Expense, type Income, type ExpenseCategory } from "@/types/finance";

const COLORS = ["#C6A66B", "#38B982", "#68A9D8", "#E5A84B", "#E06B67", "#A6A29A", "#8B5CF6", "#EC4899", "#14B8A6", "#F43F5E"];

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

interface CashFlowPoint {
  date: string;
  income: number;
  expenses: number;
}

export function FinanceOverview({
  expenses,
  income,
}: {
  expenses: Expense[];
  income: Income[];
}) {
  const mounted = useMounted();

  const totalIncome = income.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const grossProfit = totalIncome * 0.65; // Demo estimated COGS margin

  // Group expenses by category for the pie chart
  const expensesByCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  const pieData = Object.entries(expensesByCategory)
    .map(([key, value]) => ({
      name: EXPENSE_CATEGORY_LABELS[key as ExpenseCategory],
      value,
    }))
    .sort((a, b) => b.value - a.value);

  // Aggregate daily totals by date
  const incByDate = new Map<string, number>();
  for (const i of income) {
    const d = i.date.slice(0, 10);
    incByDate.set(d, (incByDate.get(d) ?? 0) + i.amount);
  }
  const expByDate = new Map<string, number>();
  for (const e of expenses) {
    const d = e.date.slice(0, 10);
    expByDate.set(d, (expByDate.get(d) ?? 0) + e.amount);
  }

  const allDates = Array.from(new Set([...incByDate.keys(), ...expByDate.keys()])).sort();

  // Build cumulative cash flow via reduce (no outer mutation → Compiler-safe)
  const cashFlowData: CashFlowPoint[] = allDates.reduce<CashFlowPoint[]>((acc, date) => {
    const prev = acc.length > 0 ? acc[acc.length - 1] : { income: 0, expenses: 0 };
    const dayInc = incByDate.get(date) ?? 0;
    const dayExp = expByDate.get(date) ?? 0;
    return [
      ...acc,
      {
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        income: prev.income + dayInc,
        expenses: prev.expenses + dayExp,
      },
    ];
  }, []);

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted">Total Income</p>
            <p className="tabular mt-2 font-heading text-2xl font-semibold">{formatCurrency(totalIncome)}</p>
            <div className="mt-1 flex items-center gap-1 text-xs text-success">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+12.4% vs prev</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted">Total Expenses</p>
            <p className="tabular mt-2 font-heading text-2xl font-semibold">{formatCurrency(totalExpenses)}</p>
            <div className="mt-1 flex items-center gap-1 text-xs text-warning">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+4.1% vs prev</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted">Gross Profit</p>
            <p className="tabular mt-2 font-heading text-2xl font-semibold">{formatCurrency(grossProfit)}</p>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted">
              <span>Est. 65% margin</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted">Net Profit (Est)</p>
            <p className={`tabular mt-2 font-heading text-2xl font-semibold ${netProfit >= 0 ? "text-success" : "text-danger"}`}>
              {formatCurrency(netProfit)}
            </p>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted">
              <span>Management summary</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>Cash flow</CardTitle>
            <CardDescription>Cumulative income vs expenses</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {mounted && cashFlowData.length > 0 ? (
              <div className="h-[280px] w-full text-muted">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashFlowData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="inc-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38B982" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#38B982" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="exp-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E06B67" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#E06B67" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="currentColor" strokeOpacity={0.15} vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: "currentColor", fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: "currentColor", fontSize: 11 }} tickLine={false} axisLine={false} width={60} tickFormatter={(v) => `$${v/1000}k`} />
                    <Tooltip
                      contentStyle={{ background: "#242424", border: "1px solid #353535", borderRadius: "6px", fontSize: "12px" }}
                      itemStyle={{ color: "#F5F0E7" }}
                    />
                    <Area type="monotone" dataKey="income" name="Income" stroke="#38B982" strokeWidth={2} fill="url(#inc-grad)" />
                    <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#E06B67" strokeWidth={2} fill="url(#exp-grad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[280px] animate-pulse rounded bg-surface" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense breakdown</CardTitle>
            <CardDescription>By category</CardDescription>
          </CardHeader>
          <CardContent>
            {mounted && pieData.length > 0 ? (
              <div className="flex h-[280px] flex-col">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50} stroke="transparent">
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip
                        formatter={(value) => {
                          const v = Array.isArray(value) ? value[0] : value;
                          return formatCurrency(Number(v) || 0);
                        }}
                        contentStyle={{ background: "#242424", border: "1px solid #353535", borderRadius: "6px", fontSize: "12px" }}
                        itemStyle={{ color: "#F5F0E7" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
                  {pieData.slice(0, 6).map((d, i) => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-muted truncate">{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[280px] animate-pulse rounded bg-surface" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}