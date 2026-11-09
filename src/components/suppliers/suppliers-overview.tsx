"use client";

import { Truck, Activity, ShoppingBag, Banknote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Supplier, PurchaseOrder } from "@/types/suppliers";

export function SuppliersOverview({
  suppliers,
  purchaseOrders,
}: {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
}) {
  const total = suppliers.length;
  const active = suppliers.filter((s) => s.status === "active").length;

  const openPOs = purchaseOrders.filter(
    (po) =>
      po.status !== "received" &&
      po.status !== "cancelled" &&
      po.status !== "draft"
  ).length;

  const outstandingPOCost = purchaseOrders
    .filter(
      (po) =>
        po.status !== "received" &&
        po.status !== "cancelled" &&
        po.status !== "draft"
    )
    .reduce((sum, po) => {
      const remainingValue = po.items.reduce(
        (s, i) => s + Math.max(0, i.quantity - i.receivedQty) * i.unitCost,
        0
      );
      return sum + remainingValue * 1.1;
    }, 0);

  const cards = [
    { label: "Total suppliers", value: total.toString(), icon: Truck, hint: "Every supplier on record." },
    { label: "Active suppliers", value: active.toString(), icon: Activity, hint: "Suppliers with active status." },
    { label: "Open purchase orders", value: openPOs.toString(), icon: ShoppingBag, hint: "Approved, ordered, or partially received." },
    { label: "Outstanding PO cost", value: formatCurrency(outstandingPOCost), icon: Banknote, hint: "Estimated cost of unreceived items." },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
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