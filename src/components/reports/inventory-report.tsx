"use client";

import { useSyncExternalStore } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { getInventoryValuation } from "@/data/reports";

const emptySubscribe = () => () => {};
function useMounted() { return useSyncExternalStore(emptySubscribe, () => true, () => false); }

export function InventoryReport() {
  const mounted = useMounted();
  const data = getInventoryValuation();
  const totalValue = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted">Total Inventory Value</p>
            <p className="tabular mt-2 font-heading text-2xl font-semibold">{formatCurrency(totalValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted">Low Stock Items</p>
            <p className="tabular mt-2 font-heading text-2xl font-semibold text-warning">7</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted">Out of Stock</p>
            <p className="tabular mt-2 font-heading text-2xl font-semibold text-danger">1</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Stock Valuation by Category</CardTitle></CardHeader>
        <CardContent>
          {mounted ? (
            <div className="h-[350px] w-full text-muted">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid stroke="currentColor" strokeOpacity={0.15} vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "currentColor", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "currentColor", fontSize: 11 }} tickLine={false} axisLine={false} width={60} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip cursor={{ fill: "#C6A66B", opacity: 0.1 }} contentStyle={{ background: "#242424", border: "1px solid #353535", borderRadius: "6px" }} itemStyle={{ color: "#F5F0E7" }} formatter={(v) => formatCurrency(Number(v))} />
                  <Bar dataKey="value" name="Valuation" fill="#C6A66B" radius={[4, 4, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <div className="h-[350px] animate-pulse rounded bg-surface" />}
        </CardContent>
      </Card>
    </div>
  );
}