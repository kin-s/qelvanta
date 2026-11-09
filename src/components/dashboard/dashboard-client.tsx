"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KpiCard, KpiCardSkeleton } from "./kpi-card";
import { ChartCard, ChartSkeleton } from "./chart-card";
import { DateRangeFilter } from "./date-range-filter";
import { ActivityFeed } from "./activity-feed";
import { QuickActions } from "./quick-actions";
import {
  RevenueExpensesChart,
  SalesPerformanceChart,
  CustomerGrowthChart,
  TopProductsChart,
  PaymentMethodsChart,
  InventoryStatusChart,
} from "./charts";
import {
  getDashboardKpis,
  getRevenueSeries,
  getSalesSeries,
  getCustomerGrowthSeries,
  getTopProducts,
  getPaymentMethods,
  getInventoryStatus,
  getRecentActivity,
} from "@/data/dashboard";
import type { DateRange } from "@/types/dashboard";

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function DashboardClient() {
  const [range, setRange] = useState<DateRange>("last30");
  const mounted = useIsMounted();

  const kpis = getDashboardKpis(range);
  const revenue = getRevenueSeries(range);
  const sales = getSalesSeries(range);
  const customers = getCustomerGrowthSeries(range);
  const topProducts = getTopProducts();
  const paymentMethods = getPaymentMethods();
  const inventoryStatus = getInventoryStatus();
  const activity = getRecentActivity();

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted">
            A live snapshot of your business.{" "}
            <span className="text-xs">Values are simulated demonstration data.</span>
          </p>
        </div>
        <DateRangeFilter value={range} onChange={setRange} />
      </motion.div>

      {/* KPI Grid with Staggered Entrance */}
      <motion.div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" variants={containerVariants}>
        {!mounted
          ? Array.from({ length: 8 }).map((_, i) => <KpiCardSkeleton key={i} />)
          : kpis.map((kpi) => (
              <motion.div key={kpi.key} variants={itemVariants}>
                <KpiCard kpi={kpi} />
              </motion.div>
            ))}
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Revenue vs expenses"
          description="Total for the selected period"
          className="lg:col-span-2"
        >
          {mounted ? <RevenueExpensesChart data={revenue} /> : <ChartSkeleton />}
        </ChartCard>
        <ChartCard title="Payment methods" description="Share of total sales">
          {mounted ? <PaymentMethodsChart data={paymentMethods} /> : <ChartSkeleton height={240} />}
        </ChartCard>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Sales performance" description="Daily transaction count">
          {mounted ? <SalesPerformanceChart data={sales} /> : <ChartSkeleton height={240} />}
        </ChartCard>
        <ChartCard title="Customer growth" description="Total active customers">
          {mounted ? <CustomerGrowthChart data={customers} /> : <ChartSkeleton height={240} />}
        </ChartCard>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Top-selling products"
          description="By revenue in the selected period"
          className="lg:col-span-2"
        >
          {mounted ? <TopProductsChart data={topProducts} /> : <ChartSkeleton />}
        </ChartCard>
        <ChartCard title="Inventory status" description="Across all locations">
          {mounted ? <InventoryStatusChart data={inventoryStatus} /> : <ChartSkeleton height={240} />}
        </ChartCard>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={activity} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <QuickActions />
            <div className="rounded-md border border-accent/30 bg-gradient-to-br from-accent/5 to-transparent p-4">
              <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-accent">
                <Sparkles className="h-3.5 w-3.5" />
                AI-powered insights
              </div>
              <p className="text-xs text-muted">
                Ask questions about your business in plain language.
              </p>
              <Button asChild variant="secondary" size="sm" className="mt-3 w-full">
                <Link href="/ai-assistant">Open AI assistant</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}