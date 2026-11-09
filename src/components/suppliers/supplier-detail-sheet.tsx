"use client";

import { useState } from "react";
import {
  Truck, Mail, Phone, MapPin, Pencil, Trash2, Package, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
  SheetBody, SheetFooter,
} from "@/components/ui/sheet";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import {
  PO_STATUS_LABELS, PO_STATUS_VARIANTS,
  type Supplier, type PurchaseOrder,
} from "@/types/suppliers";
import type { Product } from "@/types/inventory";

type Tab = "overview" | "products" | "pos";

export function SupplierDetailSheet({
  open,
  onOpenChange,
  supplier,
  products,
  purchaseOrders,
  onEdit,
  onDelete,
  onViewPO,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
  products: Product[];
  purchaseOrders: PurchaseOrder[];
  onEdit: (s: Supplier) => void;
  onDelete: (s: Supplier) => void;
  onViewPO: (po: PurchaseOrder) => void;
}) {
  const [tab, setTab] = useState<Tab>("overview");

  if (!supplier) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent />
      </Sheet>
    );
  }

  const supplierPOs = purchaseOrders
    .filter((po) => po.supplierId === supplier.id)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const suppliedProducts = products.filter(
    (p) => p.brand && p.brand.toLowerCase() === supplier.name.split(" ")[0].toLowerCase()
  );
  const productIdsFromPOs = new Set(
    supplierPOs.flatMap((po) => po.items.map((i) => i.productId))
  );
  const relatedProducts = products.filter(
    (p) => suppliedProducts.includes(p) || productIdsFromPOs.has(p.id)
  );

  const totalSpend = supplierPOs
    .filter((po) => po.status === "received")
    .reduce((s, po) => s + po.total, 0);
  const outstandingSpend = supplierPOs
    .filter((po) => po.status !== "received" && po.status !== "cancelled" && po.status !== "draft")
    .reduce((s, po) => s + po.total, 0);

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "products", label: "Products", count: relatedProducts.length },
    { id: "pos", label: "POs", count: supplierPOs.length },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="pr-2 flex items-center gap-2">
            <Truck className="h-4 w-4 text-accent" />
            {supplier.name}
          </SheetTitle>
          <SheetDescription>
            {supplier.country}
            {supplier.city && ` · ${supplier.city}`}
          </SheetDescription>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant={supplier.status === "active" ? "success" : "muted"}>
              {supplier.status}
            </Badge>
            <Badge variant="muted">{supplier.paymentTerms}</Badge>
          </div>
        </SheetHeader>

        <div className="flex gap-1 border-b border-border px-5">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-medium transition-colors",
                tab === t.id
                  ? "border-accent text-foreground"
                  : "border-transparent text-muted hover:text-foreground"
              )}
            >
              {t.label}
              {typeof t.count === "number" && (
                <span className="rounded-full bg-surface px-1.5 py-0.5 text-[10px] text-muted">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <SheetBody>
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-2">
                <StatCard label="Received spend" value={formatCurrency(totalSpend)} />
                <StatCard
                  label="Outstanding"
                  value={formatCurrency(outstandingSpend)}
                  highlight={outstandingSpend > 0}
                />
              </div>

              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                  Contact
                </h3>
                <dl className="space-y-1.5 text-sm">
                  <Row icon={Mail} label="Email" value={supplier.email || "—"} />
                  <Row icon={Phone} label="Phone" value={supplier.phone || "—"} />
                  <Row
                    icon={MapPin}
                    label="Address"
                    value={
                      [supplier.address, supplier.city, supplier.country]
                        .filter(Boolean)
                        .join(", ") || "—"
                    }
                  />
                </dl>
              </section>

              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                  Details
                </h3>
                <dl className="space-y-1.5 text-sm">
                  <PlainRow label="Contact person" value={supplier.contactName || "—"} />
                  <PlainRow label="Tax ID" value={supplier.taxId || "—"} />
                  <PlainRow label="Payment terms" value={supplier.paymentTerms} />
                  <PlainRow label="Supplier since" value={formatDate(supplier.createdAt, "en-US", { month: "short", year: "numeric" })} />
                  <PlainRow label="Last updated" value={formatDate(supplier.updatedAt)} />
                </dl>
              </section>

              {supplier.notes && (
                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                    Notes
                  </h3>
                  <p className="rounded-md border border-border bg-surface/40 p-3 text-sm text-muted">
                    {supplier.notes}
                  </p>
                </section>
              )}
            </div>
          )}

          {tab === "products" && (
            <div className="space-y-2">
              {relatedProducts.length === 0 ? (
                <p className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted">
                  No products linked to this supplier yet.
                </p>
              ) : (
                relatedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-start justify-between gap-2 rounded-md border border-border bg-surface/40 p-3"
                  >
                    <div className="flex min-w-0 items-start gap-2">
                      <Package className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-muted">{p.sku} · {p.brand || "—"}</p>
                      </div>
                    </div>
                    <span className="tabular shrink-0 text-sm">{formatCurrency(p.purchasePrice)}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "pos" && (
            <div className="space-y-2">
              {supplierPOs.length === 0 ? (
                <p className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted">
                  No purchase orders for this supplier yet.
                </p>
              ) : (
                supplierPOs.map((po) => (
                  <button
                    key={po.id}
                    type="button"
                    onClick={() => onViewPO(po)}
                    className="flex w-full items-start justify-between gap-2 rounded-md border border-border bg-surface/40 p-3 text-left transition-colors hover:border-accent/40"
                  >
                    <div className="flex min-w-0 items-start gap-2">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{po.id}</p>
                        <p className="text-xs text-muted">
                          {formatDate(po.createdAt, "en-US", { month: "short", day: "numeric" })}
                          {" · "}
                          {po.items.length} item{po.items.length === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="tabular text-sm font-medium">{formatCurrency(po.total)}</span>
                      <Badge variant={PO_STATUS_VARIANTS[po.status]}>
                        {PO_STATUS_LABELS[po.status]}
                      </Badge>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </SheetBody>

        <SheetFooter>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(supplier)}
          >
            <Pencil />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-danger [&_svg]:text-danger"
            onClick={() => onDelete(supplier)}
          >
            <Trash2 />
            Delete
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-md border border-border bg-surface/40 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
      <p className={cn("tabular mt-0.5 text-sm font-medium", highlight ? "text-warning" : "text-foreground")}>
        {value}
      </p>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/60 py-1.5 last:border-0">
      <dt className="flex items-center gap-1.5 text-muted">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}

function PlainRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 py-1.5 last:border-0">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}