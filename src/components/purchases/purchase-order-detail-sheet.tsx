"use client";

import {
  FileText, Package, PackageCheck, CheckCircle2, XCircle, Clock,
  ArrowRight, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
  SheetBody, SheetFooter,
} from "@/components/ui/sheet";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  PO_STATUS_LABELS, PO_STATUS_VARIANTS, poProgressPct, isFullyReceived,
  type PurchaseOrder, type PurchaseOrderStatus,
} from "@/types/suppliers";

export function PurchaseOrderDetailSheet({
  open,
  onOpenChange,
  po,
  onChangeStatus,
  onReceive,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  po: PurchaseOrder | null;
  onChangeStatus: (po: PurchaseOrder, next: PurchaseOrderStatus) => void;
  onReceive: (po: PurchaseOrder) => void;
  onDelete: (po: PurchaseOrder) => void;
}) {
  if (!po) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent />
      </Sheet>
    );
  }

  const progress = poProgressPct(po);
  const canReceive = po.status === "ordered" || po.status === "partially_received";
  const canApprove = po.status === "pending_approval";
  const canOrder = po.status === "approved";
  const canCancel = po.status !== "received" && po.status !== "cancelled";
  const canDelete = po.status === "draft" || po.status === "cancelled";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="pr-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-accent" />
            {po.id}
          </SheetTitle>
          <SheetDescription>
            {po.supplierName} · Created {formatDate(po.createdAt, "en-US", { month: "short", day: "numeric", year: "numeric" })}
          </SheetDescription>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant={PO_STATUS_VARIANTS[po.status]}>
              {PO_STATUS_LABELS[po.status]}
            </Badge>
            {isFullyReceived(po) && <Badge variant="success">Fully received</Badge>}
          </div>
        </SheetHeader>

        <SheetBody className="space-y-6">
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Delivery
            </h3>
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between border-b border-border/60 py-1.5 last:border-0">
                <dt className="text-muted">Expected</dt>
                <dd>{formatDate(po.expectedDelivery, "en-US", { month: "short", day: "numeric", year: "numeric" })}</dd>
              </div>
              {po.receivedAt && (
                <div className="flex justify-between border-b border-border/60 py-1.5 last:border-0">
                  <dt className="text-muted">Received</dt>
                  <dd>{formatDate(po.receivedAt)}</dd>
                </div>
              )}
              <div className="flex justify-between border-b border-border/60 py-1.5 last:border-0">
                <dt className="text-muted">Created by</dt>
                <dd>{po.createdBy}</dd>
              </div>
            </dl>
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                Progress
              </h3>
              <span className="tabular text-xs text-muted">{progress}% received</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full bg-accent transition-[width]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </section>

          <section>
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
              <Package className="h-3 w-3" />
              Items ({po.items.length})
            </h3>
            <div className="overflow-hidden rounded-md border border-border">
              <ul className="divide-y divide-border">
                {po.items.map((item) => {
                  const remaining = item.quantity - item.receivedQty;
                  const complete = remaining === 0;
                  return (
                    <li key={item.productId} className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{item.productName}</p>
                          <p className="text-[10px] text-muted">
                            {item.sku} · {formatCurrency(item.unitCost)} each
                          </p>
                        </div>
                        <span className="tabular shrink-0 text-sm font-medium">
                          {formatCurrency(item.lineTotal)}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-[11px]">
                        <span className="text-muted">
                          Ordered {item.quantity} · Received {item.receivedQty}
                        </span>
                        {complete ? (
                          <span className="flex items-center gap-0.5 text-success">
                            <CheckCircle2 className="h-3 w-3" />
                            Complete
                          </span>
                        ) : (
                          <span className="text-warning">{remaining} remaining</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Totals</h3>
            <div className="space-y-1.5 rounded-md border border-border bg-surface/40 p-3 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="tabular">{formatCurrency(po.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Tax</span>
                <span className="tabular">{formatCurrency(po.taxAmount)}</span>
              </div>
              <Separator className="!my-1.5" />
              <div className="flex justify-between font-heading text-base font-semibold">
                <span>Total</span>
                <span className="tabular">{formatCurrency(po.total)}</span>
              </div>
            </div>
          </section>

          {po.notes && (
            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                Notes
              </h3>
              <p className="rounded-md border border-border bg-surface/40 p-3 text-sm text-muted">
                {po.notes}
              </p>
            </section>
          )}
        </SheetBody>

        <SheetFooter className="flex-wrap">
          {canApprove && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChangeStatus(po, "cancelled")}
                className="text-danger [&_svg]:text-danger"
              >
                <XCircle />
                Reject
              </Button>
              <Button size="sm" onClick={() => onChangeStatus(po, "approved")}>
                <CheckCircle2 />
                Approve
              </Button>
            </>
          )}

          {canOrder && (
            <Button size="sm" onClick={() => onChangeStatus(po, "ordered")} className="flex-1">
              <ArrowRight />
              Mark as ordered
            </Button>
          )}

          {canReceive && (
            <Button size="sm" onClick={() => onReceive(po)} className="flex-1">
              <PackageCheck />
              Receive goods
            </Button>
          )}

          {po.status === "draft" && (
            <Button size="sm" onClick={() => onChangeStatus(po, "pending_approval")} className="flex-1">
              <Clock />
              Submit for approval
            </Button>
          )}

          {canCancel && (po.status === "approved" || po.status === "ordered" || po.status === "partially_received") && (
            <Button
              variant="ghost"
              size="sm"
              className="text-danger [&_svg]:text-danger"
              onClick={() => onChangeStatus(po, "cancelled")}
            >
              <XCircle />
              Cancel
            </Button>
          )}

          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="text-danger [&_svg]:text-danger"
              onClick={() => onDelete(po)}
            >
              <Trash2 />
              Delete
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}