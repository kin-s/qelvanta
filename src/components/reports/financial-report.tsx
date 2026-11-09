"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { getFinancialSummary } from "@/data/reports";
import type { ReportRange } from "@/types/reports";

export function FinancialReport({ range }: { range: ReportRange }) {
  const summary = getFinancialSummary(range);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Management P&L Summary</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between font-medium">
            <span>Total Revenue</span>
            <span className="tabular">{formatCurrency(summary.revenue)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span className="pl-4">Cost of Goods Sold (COGS)</span>
            <span className="tabular">−{formatCurrency(summary.cogs)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Gross Profit</span>
            <span className="tabular">{formatCurrency(summary.grossProfit)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span className="pl-4">Operating Expenses</span>
            <span className="tabular">−{formatCurrency(summary.expenses)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>Net Profit</span>
            <span className="tabular text-success">{formatCurrency(summary.netProfit)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Financial Health & Margins</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted">Gross Margin</span>
              <span className="font-medium">{((summary.grossProfit / summary.revenue) * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 rounded-full bg-surface overflow-hidden">
              <div className="h-full bg-accent" style={{ width: `${(summary.grossProfit / summary.revenue) * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted">Net Margin</span>
              <span className="font-medium text-success">{((summary.netProfit / summary.revenue) * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 rounded-full bg-surface overflow-hidden">
              <div className="h-full bg-success" style={{ width: `${(summary.netProfit / summary.revenue) * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted">Operating Expense Ratio</span>
              <span className="font-medium text-danger">{((summary.expenses / summary.revenue) * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 rounded-full bg-surface overflow-hidden">
              <div className="h-full bg-danger" style={{ width: `${(summary.expenses / summary.revenue) * 100}%` }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}