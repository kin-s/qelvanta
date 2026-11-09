"use client";

import { useSyncExternalStore } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { getSalesData, getSalesByCategory } from "@/data/reports";
import type { ReportRange } from "@/types/reports";

const COLORS = ["#C6A66B", "#38B982", "#68A9D8", "#E5A84B", "#E06B67", "#A6A29A"];
const emptySubscribe = () => () => {};
function useMounted() { return useSyncExternalStore(emptySubscribe, () => true, () => false); }

export function SalesReport({ range }: { range: ReportRange }) {
  const mounted = useMounted();
  const data = getSalesData(range);
  const categories = getSalesByCategory();

  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = data.reduce((s, d) => s + d.orders, 0);
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted">Total Revenue</p>
            <p className="tabular mt-2 font-heading text-2xl font-semibold">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted">Total Orders</p>
            <p className="tabular mt-2 font-heading text-2xl font-semibold">{totalOrders.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted">Avg Order Value (AOV)</p>
            <p className="tabular mt-2 font-heading text-2xl font-semibold">{formatCurrency(aov)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Revenue Over Time</CardTitle></CardHeader>
          <CardContent>
            {mounted ? (
              <div className="h-[300px] w-full text-muted">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C6A66B" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#C6A66B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="currentColor" strokeOpacity={0.15} vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: "currentColor", fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={30} />
                    <YAxis tick={{ fill: "currentColor", fontSize: 11 }} tickLine={false} axisLine={false} width={60} tickFormatter={(v) => `$${v/1000}k`} />
                    <Tooltip contentStyle={{ background: "#242424", border: "1px solid #353535", borderRadius: "6px", fontSize: "12px" }} itemStyle={{ color: "#F5F0E7" }} />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#C6A66B" strokeWidth={2} fill="url(#revGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : <div className="h-[300px] animate-pulse rounded bg-surface" />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Revenue by Category</CardTitle></CardHeader>
          <CardContent>
            {mounted ? (
              <div className="h-[300px] flex flex-col">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50} stroke="transparent">
                        {categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => formatCurrency(Number(v))} contentStyle={{ background: "#242424", border: "1px solid #353535", borderRadius: "6px" }} itemStyle={{ color: "#F5F0E7" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {categories.map((c, i) => (
                    <div key={c.name} className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-muted truncate">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : <div className="h-[300px] animate-pulse rounded bg-surface" />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}