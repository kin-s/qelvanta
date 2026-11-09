"use client";

import { ArrowUpRight, ArrowDownRight, Minus, Info } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Kpi } from "@/types/dashboard";

function formatValue(value: number, format: "currency" | "number"): string {
  if (format === "currency") {
    if (Math.abs(value) >= 1_000_000) {
      return new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1,
      }).format(value);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency", currency: "USD", maximumFractionDigits: 0,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US").format(value);
}

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const trendIcon =
    kpi.trend === "up" ? ArrowUpRight : kpi.trend === "down" ? ArrowDownRight : Minus;
  const TrendIcon = trendIcon;
  const trendColor =
    kpi.change === null
      ? "text-muted"
      : kpi.positive
        ? "text-success"
        : "text-danger";

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs uppercase tracking-wider text-muted">{kpi.label}</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-muted/60 hover:text-muted"
                  aria-label={`About ${kpi.label}`}
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[220px]">
                {kpi.hint}
              </TooltipContent>
            </Tooltip>
          </div>

          <p className="tabular mt-2 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            {formatValue(kpi.value, kpi.format)}
          </p>

          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <span className={cn("inline-flex items-center gap-0.5", trendColor)}>
              <TrendIcon className="h-3.5 w-3.5" />
              {kpi.change === null
                ? "—"
                : `${kpi.change >= 0 ? "+" : ""}${kpi.change.toFixed(1)}%`}
            </span>
            <span className="text-muted">vs previous period</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function KpiCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="h-3 w-24 animate-pulse rounded bg-surface" />
        <div className="mt-3 h-8 w-32 animate-pulse rounded bg-surface" />
        <div className="mt-2 h-3 w-40 animate-pulse rounded bg-surface" />
      </CardContent>
    </Card>
  );
}