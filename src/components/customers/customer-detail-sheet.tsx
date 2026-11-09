"use client";

import {
  User as UserIcon, Building2, Mail, Phone, MapPin, Pencil, Trash2,
  ShoppingBag, Banknote, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
  SheetBody, SheetFooter,
} from "@/components/ui/sheet";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  SEGMENT_LABELS, SEGMENT_VARIANTS, type Customer,
} from "@/types/customers";
import { PAYMENT_METHOD_LABELS, type Sale } from "@/types/sales";

export function CustomerDetailSheet({
  open,
  onOpenChange,
  customer,
  sales,
  onEdit,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  sales: Sale[];
  onEdit: (c: Customer) => void;
  onDelete: (c: Customer) => void;
}) {
  if (!customer) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent />
      </Sheet>
    );
  }

  const customerSales = sales
    .filter((s) => s.customerId === customer.id)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const totalPurchases = customerSales.reduce((s, sale) => s + sale.total, 0);
  const totalRefunded = customerSales.reduce(
    (s, sale) => s + (sale.refunds ?? []).reduce((rs, r) => rs + r.amount, 0),
    0
  );
  const outstanding = Math.max(0, totalPurchases - totalRefunded);
  const avgOrder =
    customerSales.length > 0 ? totalPurchases / customerSales.length : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="pr-2 flex items-center gap-2">
            {customer.type === "business" ? (
              <Building2 className="h-4 w-4 text-accent" />
            ) : (
              <UserIcon className="h-4 w-4 text-accent" />
            )}
            {customer.name}
          </SheetTitle>
          <SheetDescription>
            {customer.type === "business" ? customer.company : "Individual"}
            {customer.country && ` · ${customer.country}`}
          </SheetDescription>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant={SEGMENT_VARIANTS[customer.segment]}>
              {SEGMENT_LABELS[customer.segment]}
            </Badge>
            <Badge variant={customer.status === "active" ? "success" : "muted"}>
              {customer.status}
            </Badge>
          </div>
        </SheetHeader>

        <SheetBody className="space-y-6">
          <section>
            <div className="grid grid-cols-3 gap-2">
              <StatCard label="Purchases" value={formatCurrency(totalPurchases)} icon={ShoppingBag} />
              <StatCard label="Outstanding" value={formatCurrency(outstanding)} icon={Banknote} highlight={outstanding > 0} />
              <StatCard label="Avg order" value={formatCurrency(avgOrder)} icon={TrendingUp} />
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Contact
            </h3>
            <dl className="space-y-1.5 text-sm">
              <Row icon={Mail} label="Email" value={customer.email || "—"} />
              <Row icon={Phone} label="Phone" value={customer.phone || "—"} />
              <Row
                icon={MapPin}
                label="Address"
                value={
                  [customer.address, customer.city, customer.country]
                    .filter(Boolean)
                    .join(", ") || "—"
                }
              />
            </dl>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Account
            </h3>
            <dl className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between border-b border-border/60 py-1.5 last:border-0">
                <dt className="text-muted">Credit limit</dt>
                <dd className="tabular font-medium">{formatCurrency(customer.creditLimit)}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-border/60 py-1.5 last:border-0">
                <dt className="text-muted">Customer since</dt>
                <dd>{formatDate(customer.createdAt, "en-US", { month: "short", year: "numeric" })}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-border/60 py-1.5 last:border-0">
                <dt className="text-muted">Last updated</dt>
                <dd>{formatDate(customer.updatedAt)}</dd>
              </div>
            </dl>
          </section>

          {customer.notes && (
            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                Notes
              </h3>
              <p className="rounded-md border border-border bg-surface/40 p-3 text-sm text-muted">
                {customer.notes}
              </p>
            </section>
          )}

          <section>
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
              <ShoppingBag className="h-3 w-3" />
              Purchase history ({customerSales.length})
            </h3>
            {customerSales.length === 0 ? (
              <p className="rounded-md border border-dashed border-border p-4 text-center text-sm text-muted">
                No purchases recorded yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {customerSales.map((sale) => (
                  <li
                    key={sale.id}
                    className="rounded-md border border-border bg-surface/40 p-3 text-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium">{sale.id}</p>
                        <p className="text-xs text-muted">
                          {formatDate(sale.createdAt, "en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          · {PAYMENT_METHOD_LABELS[sale.paymentMethod]}
                        </p>
                      </div>
                      <span className="tabular shrink-0 font-medium">
                        {formatCurrency(sale.total)}
                      </span>
                    </div>
                    {sale.status !== "completed" && (
                      <p className="mt-1 text-[11px] text-warning">
                        {sale.status === "refunded" ? "Fully refunded" : "Partially refunded"}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </SheetBody>

        <SheetFooter>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(customer)}
          >
            <Pencil />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-danger [&_svg]:text-danger"
            onClick={() => onDelete(customer)}
          >
            <Trash2 />
            Delete
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  highlight,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-md border border-border bg-surface/40 p-2.5">
      <Icon className={"mb-1 h-3.5 w-3.5 " + (highlight ? "text-warning" : "text-muted")} />
      <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
      <p className={"tabular mt-0.5 text-sm font-medium " + (highlight ? "text-warning" : "text-foreground")}>
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