"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BarChart3, TrendingUp, Package, Users, DollarSign } from "lucide-react";
import { ReportFilter } from "./report-filter";
import { SalesReport } from "./sales-report";
import { InventoryReport } from "./inventory-report";
import { FinancialReport } from "./financial-report";
import { CustomerReport } from "./customer-report";
import { REPORT_LABELS, type ReportRange } from "@/types/reports";
import { cn } from "@/lib/utils";

type Tab = "sales" | "inventory" | "financial" | "customers";

export function ReportsClient() {
  const [range, setRange] = useState<ReportRange>("last30");
  const [tab, setTab] = useState<Tab>("sales");

  function handleExport() {
    toast.success("Report exported (simulated)", {
      description: `${REPORT_LABELS[range]} ${tab.toUpperCase()} report would download as CSV.`,
    });
  }

  const tabs = [
    { id: "sales" as const, label: "Sales", icon: TrendingUp },
    { id: "inventory" as const, label: "Inventory", icon: Package },
    { id: "financial" as const, label: "Financial", icon: DollarSign },
    { id: "customers" as const, label: "Customers", icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-accent" />
            Analytics & Reports
          </h1>
          <p className="mt-1 text-sm text-muted">
            Generate insights across your entire business.{" "}
            <span className="text-xs">Demo data — export is simulated.</span>
          </p>
        </div>
      </div>

      <ReportFilter value={range} onChange={setRange} onExport={handleExport} />

      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                tab === t.id ? "border-accent text-foreground" : "border-transparent text-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="pt-2">
        {tab === "sales" && <SalesReport range={range} />}
        {tab === "inventory" && <InventoryReport />}
        {tab === "financial" && <FinancialReport range={range} />}
        {tab === "customers" && <CustomerReport range={range} />}
      </div>
    </div>
  );
}