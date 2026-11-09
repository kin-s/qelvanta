"use client";

import { useSyncExternalStore } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getCustomerGrowthData } from "@/data/reports";
import type { ReportRange } from "@/types/reports";

const emptySubscribe = () => () => {};
function useMounted() { return useSyncExternalStore(emptySubscribe, () => true, () => false); }

export function CustomerReport({ range }: { range: ReportRange }) {
  const mounted = useMounted();
  const data = getCustomerGrowthData(range);

  const newCustomers = data.reduce((s, d) => s + d.newCustomers, 0);
  const totalCustomers = data.length > 0 ? data[data.length - 1].totalCustomers : 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted">New Customers (Period)</p>
            <p className="tabular mt-2 font-heading text-2xl font-semibold">{newCustomers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted">Total Active Customer Base</p>
            <p className="tabular mt-2 font-heading text-2xl font-semibold">{totalCustomers}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Customer Base Growth</CardTitle></CardHeader>
        <CardContent>
          {mounted ? (
            <div className="h-[350px] w-full text-muted">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid stroke="currentColor" strokeOpacity={0.15} vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: "currentColor", fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={30} />
                  <YAxis tick={{ fill: "currentColor", fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
                  <Tooltip contentStyle={{ background: "#242424", border: "1px solid #353535", borderRadius: "6px" }} itemStyle={{ color: "#F5F0E7" }} />
                  <Line type="monotone" dataKey="totalCustomers" name="Total Customers" stroke="#68A9D8" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : <div className="h-[350px] animate-pulse rounded bg-surface" />}
        </CardContent>
      </Card>
    </div>
  );
}