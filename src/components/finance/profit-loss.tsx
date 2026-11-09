"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import type { Expense, Income } from "@/types/finance";

export function ProfitLoss({ expenses, income }: { expenses: Expense[]; income: Income[] }) {
  const revenue = income.filter(i => i.category === "sales" || i.category === "services").reduce((s, i) => s + i.amount, 0);
  const otherIncome = income.filter(i => i.category !== "sales" && i.category !== "services").reduce((s, i) => s + i.amount, 0);

  const cogs = revenue * 0.35; // Estimated cost of goods sold
  const grossProfit = revenue - cogs;

  const opExpenses = expenses.filter(e => !["taxes", "other"].includes(e.category)).reduce((s, e) => s + e.amount, 0);
  const otherExpenses = expenses.filter(e => ["taxes", "other"].includes(e.category)).reduce((s, e) => s + e.amount, 0);

  const operatingProfit = grossProfit - opExpenses;
  const netProfit = operatingProfit + otherIncome - otherExpenses;

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Profit & Loss (Management)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between font-medium">
            <span>Revenue</span>
            <span className="tabular">{formatCurrency(revenue)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span className="pl-4">Cost of Goods Sold</span>
            <span className="tabular">−{formatCurrency(cogs)}</span>
          </div>
          <Separator className="my-1" />
          <div className="flex justify-between font-medium text-foreground">
            <span>Gross Profit</span>
            <span className="tabular">{formatCurrency(grossProfit)}</span>
          </div>
        </div>

        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between font-medium">
            <span>Operating Expenses</span>
            <span className="tabular">{formatCurrency(opExpenses)}</span>
          </div>
          <Separator className="my-1" />
          <div className="flex justify-between font-medium text-foreground">
            <span>Operating Profit</span>
            <span className="tabular">{formatCurrency(operatingProfit)}</span>
          </div>
        </div>

        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between font-medium">
            <span>Other Income</span>
            <span className="tabular text-success">{formatCurrency(otherIncome)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Other Expenses</span>
            <span className="tabular text-danger">−{formatCurrency(otherExpenses)}</span>
          </div>
          <Separator className="my-1" />
          <div className="flex justify-between text-base font-semibold">
            <span>Net Profit (Estimate)</span>
            <span className={`tabular ${netProfit >= 0 ? "text-success" : "text-danger"}`}>
              {formatCurrency(netProfit)}
            </span>
          </div>
        </div>

        <p className="text-[10px] text-muted text-center pt-4">
          This is a management summary and not a certified financial statement.
        </p>
      </CardContent>
    </Card>
  );
}