"use client";

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie,
  PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type {
  RevenuePoint,
  SalesPoint,
  CustomerGrowthPoint,
  NamedValue,
} from "@/types/dashboard";

const COLORS = {
  accent: "#C6A66B",
  success: "#38B982",
  danger: "#E06B67",
  warning: "#E5A84B",
  info: "#68A9D8",
};

const AXIS_PROPS = {
  stroke: "currentColor",
  tick: { fill: "currentColor", fontSize: 11 },
  tickLine: false,
  axisLine: false,
} as const;

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number | string; color?: string; dataKey?: string }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-md border border-border bg-card p-2.5 text-xs shadow-lg">
      {label && <p className="mb-1 font-medium text-foreground">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 tabular">
          <span className="flex items-center gap-1.5 text-muted">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: p.color }}
            />
            {p.name}
          </span>
          <span className="font-medium text-foreground">
            {typeof p.value === "number" ? p.value.toLocaleString("en-US") : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function RevenueExpensesChart({ data }: { data: RevenuePoint[] }) {
  return (
    <div className="h-[280px] w-full text-muted">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.accent} stopOpacity={0.35} />
              <stop offset="100%" stopColor={COLORS.accent} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="exp-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.danger} stopOpacity={0.25} />
              <stop offset="100%" stopColor={COLORS.danger} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="currentColor" strokeOpacity={0.15} vertical={false} />
          <XAxis dataKey="label" {...AXIS_PROPS} minTickGap={24} />
          <YAxis {...AXIS_PROPS} width={44} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: COLORS.accent, strokeOpacity: 0.2 }} />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke={COLORS.accent}
            strokeWidth={2}
            fill="url(#rev-grad)"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke={COLORS.danger}
            strokeWidth={2}
            fill="url(#exp-grad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SalesPerformanceChart({ data }: { data: SalesPoint[] }) {
  return (
    <div className="h-[240px] w-full text-muted">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="currentColor" strokeOpacity={0.15} vertical={false} />
          <XAxis dataKey="label" {...AXIS_PROPS} minTickGap={24} />
          <YAxis {...AXIS_PROPS} width={36} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: COLORS.success, strokeOpacity: 0.2 }} />
          <Line
            type="monotone"
            dataKey="sales"
            name="Sales"
            stroke={COLORS.success}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CustomerGrowthChart({ data }: { data: CustomerGrowthPoint[] }) {
  return (
    <div className="h-[240px] w-full text-muted">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="cust-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.info} stopOpacity={0.35} />
              <stop offset="100%" stopColor={COLORS.info} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="currentColor" strokeOpacity={0.15} vertical={false} />
          <XAxis dataKey="label" {...AXIS_PROPS} minTickGap={24} />
          <YAxis {...AXIS_PROPS} width={36} />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="customers"
            name="Customers"
            stroke={COLORS.info}
            strokeWidth={2}
            fill="url(#cust-grad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TopProductsChart({ data }: { data: NamedValue[] }) {
  return (
    <div className="h-[280px] w-full text-muted">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 16, left: 8, bottom: 0 }}
        >
          <CartesianGrid stroke="currentColor" strokeOpacity={0.15} horizontal={false} />
          <XAxis type="number" {...AXIS_PROPS} />
          <YAxis
            type="category"
            dataKey="name"
            {...AXIS_PROPS}
            width={130}
            tick={{ fill: "currentColor", fontSize: 11 }}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: COLORS.accent, fillOpacity: 0.08 }} />
          <Bar dataKey="value" name="Revenue" fill={COLORS.accent} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PaymentMethodsChart({ data }: { data: NamedValue[] }) {
  return (
    <div className="flex h-[240px] flex-col">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<ChartTooltip />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={50}
              stroke="transparent"
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.color ?? COLORS.accent} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs">
        {data.map((d) => (
          <span key={d.name} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
            <span className="text-muted">{d.name}</span>
            <span className="tabular font-medium text-foreground">{d.value}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function InventoryStatusChart({ data }: { data: NamedValue[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="flex h-[240px] flex-col">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<ChartTooltip />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={50}
              stroke="transparent"
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.color ?? COLORS.accent} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs">
        {data.map((d) => (
          <span key={d.name} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
            <span className="text-muted">{d.name}</span>
            <span className="tabular font-medium text-foreground">
              {d.value} ({Math.round((d.value / total) * 100)}%)
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}