"use client";

import { useSyncExternalStore } from "react";
import { Users, UserPlus, Activity, Crown, Banknote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Customer } from "@/types/customers";
import type { Sale } from "@/types/sales";

// Mount detection: false during SSR/prerender, true after hydration.
// Prevents "unstable value during prerender" errors for time-dependent UI.
const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function CustomersOverview({
  customers,
  sales,
}: {
  customers: Customer[];
  sales: Sale[];
}) {
  const mounted = useMounted();

  const total = customers.length;
  const active = customers.filter((c) => c.status === "active").length;
  const vip = customers.filter((c) => c.segment === "vip").length;
  const inactive = customers.filter((c) => c.status === "inactive").length;

  // New in last 30 days — only computed client-side once mounted.
  // Prevents Next 16 prerender error for `new Date()`.
  let newCount = 0;
  if (mounted) {
    const cutoff = new Date();
    cutoff.setUTCDate(cutoff.getUTCDate() - 30);
    const cutoffIso = cutoff.toISOString();
    newCount = customers.filter((c) => c.createdAt >= cutoffIso).length;
  }

  const outstandingByCustomer = new Map<string, number>();
  for (const sale of sales) {
    if (!sale.customerId) continue;
    const refunded = (sale.refunds ?? []).reduce((s, r) => s + r.amount, 0);
    const net = Math.max(0, sale.total - refunded);
    outstandingByCustomer.set(
      sale.customerId,
      (outstandingByCustomer.get(sale.customerId) ?? 0) + net
    );
  }
  const outstanding = Array.from(outstandingByCustomer.values()).reduce(
    (s, v) => s + v,
    0
  );

  const cards = [
    { label: "Total customers", value: total.toString(), icon: Users, hint: "Every customer on record." },
    { label: "Active customers", value: active.toString(), icon: Activity, hint: "Customers with active status." },
    { label: "New (30 days)", value: mounted ? newCount.toString() : "—", icon: UserPlus, hint: "Signed up in the last 30 days." },
    { label: "VIP customers", value: vip.toString(), icon: Crown, hint: "Customers in the VIP segment." },
    { label: "Inactive customers", value: inactive.toString(), icon: Activity, hint: "Customers flagged inactive.", variant: "warning" as const },
    { label: "Outstanding balance", value: formatCurrency(outstanding), icon: Banknote, hint: "Sum of unpaid balances across all customers." },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">{c.label}</p>
                  <p className="tabular mt-2 font-heading text-2xl font-semibold">{c.value}</p>
                  <p className="mt-1 text-[11px] text-muted">{c.hint}</p>
                </div>
                <div
                  className={
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-md " +
                    (c.variant === "warning"
                      ? "bg-warning/15 text-warning"
                      : "bg-accent/10 text-accent")
                  }
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}