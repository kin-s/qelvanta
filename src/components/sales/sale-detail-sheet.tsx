"use client";

import { Printer, RotateCcw, Package, User as UserIcon, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
  SheetBody, SheetFooter,
} from "@/components/ui/sheet";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  PAYMENT_METHOD_LABELS, REFUND_METHOD_LABELS, REFUND_REASON_LABELS,
  totalRefunded, refundedQtyForProduct,
  type Sale,
} from "@/types/sales";

export function SaleDetailSheet({
  open,
  onOpenChange,
  sale,
  onReprint,
  onRefund,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: Sale | null;
  onReprint: (sale: Sale) => void;
  onRefund: (sale: Sale) => void;
}) {
  if (!sale) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent />
      </Sheet>
    );
  }

  const refunds = sale.refunds ?? [];
  const refunded = totalRefunded(sale);
  const netTotal = Math.round((sale.total - refunded) * 100) / 100;
  const hasRefunds = refunds.length > 0;
  const fullyRefunded = sale.status === "refunded";
  const canRefund = !fullyRefunded;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="pr-2">{sale.id}</SheetTitle>
          <SheetDescription>
            {formatDate(sale.createdAt, "en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            · Cashier {sale.cashier}
          </SheetDescription>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {sale.status === "completed" && <Badge variant="success">Completed</Badge>}
            {sale.status === "partially_refunded" && <Badge variant="warning">Partially refunded</Badge>}
            {sale.status === "refunded" && <Badge variant="danger">Refunded</Badge>}
            <Badge variant="muted">{PAYMENT_METHOD_LABELS[sale.paymentMethod]}</Badge>
          </div>
        </SheetHeader>

        <SheetBody className="space-y-6">
          <section>
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
              <UserIcon className="h-3 w-3" />
              Customer
            </h3>
            <div className="rounded-md border border-border bg-surface/40 p-3">
              <p className="font-medium">{sale.customerName}</p>
              {sale.customerId && (
                <p className="text-xs text-muted">ID: {sale.customerId}</p>
              )}
            </div>
          </section>

          <section>
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
              <Package className="h-3 w-3" />
              Items
            </h3>
            <div className="overflow-hidden rounded-md border border-border">
              <table className="w-full text-sm">
                <thead className="bg-surface/60">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted">Item</th>
                    <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-muted">Qty</th>
                    <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-muted">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sale.items.map((item) => {
                    const refundedQty = refundedQtyForProduct(sale, item.productId);
                    return (
                      <tr key={item.productId}>
                        <td className="px-3 py-2.5">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-[10px] text-muted">
                            {item.sku} · {formatCurrency(item.unitPrice)} each
                          </p>
                        </td>
                        <td className="px-3 py-2.5 text-right align-top">
                          <span className="tabular">{item.quantity}</span>
                          {refundedQty > 0 && (
                            <p className="text-[10px] text-warning">
                              −{refundedQty} refunded
                            </p>
                          )}
                        </td>
                        <td className="tabular px-3 py-2.5 text-right align-top font-medium">
                          {formatCurrency(item.lineTotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Totals</h3>
            <div className="space-y-1.5 rounded-md border border-border bg-surface/40 p-3 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="tabular">{formatCurrency(sale.subtotal)}</span>
              </div>
              {sale.discountAmount > 0 && (
                <div className="flex justify-between text-muted">
                  <span>Discount ({sale.discountPct}%)</span>
                  <span className="tabular">−{formatCurrency(sale.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <span>Tax</span>
                <span className="tabular">{formatCurrency(sale.taxAmount)}</span>
              </div>
              <Separator className="!my-1.5" />
              <div className="flex justify-between font-medium">
                <span>Original total</span>
                <span className="tabular">{formatCurrency(sale.total)}</span>
              </div>
              {hasRefunds && (
                <>
                  <div className="flex justify-between text-danger">
                    <span>Refunded</span>
                    <span className="tabular">−{formatCurrency(refunded)}</span>
                  </div>
                  <Separator className="!my-1.5" />
                  <div className="flex justify-between font-heading text-base font-semibold">
                    <span>Net</span>
                    <span className="tabular">{formatCurrency(netTotal)}</span>
                  </div>
                </>
              )}
            </div>
          </section>

          {hasRefunds && (
            <section>
              <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                <RotateCcw className="h-3 w-3" />
                Refund history
              </h3>
              <ul className="space-y-2">
                {refunds.map((r) => (
                  <li key={r.id} className="rounded-md border border-border bg-surface/40 p-3 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium">{r.id}</p>
                        <p className="text-xs text-muted">
                          {formatDate(r.createdAt, "en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          · {REFUND_REASON_LABELS[r.reason]}
                        </p>
                        <p className="mt-1 text-[11px] text-muted">
                          {REFUND_METHOD_LABELS[r.method]} · {r.cashier}
                        </p>
                      </div>
                      <span className="tabular shrink-0 font-medium text-danger">
                        −{formatCurrency(r.amount)}
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1 border-t border-border pt-2">
                      {r.items.map((item, i) => (
                        <li key={i} className="flex justify-between text-xs">
                          <span className="text-muted">
                            {item.quantity} × {item.name}
                          </span>
                          <span className="tabular">{formatCurrency(item.lineRefund)}</span>
                        </li>
                      ))}
                    </ul>
                    {r.reasonNote && (
                      <p className="mt-1.5 text-xs italic text-muted">&ldquo;{r.reasonNote}&rdquo;</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </SheetBody>

        <SheetFooter>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => onReprint(sale)}
          >
            <Printer />
            Reprint
          </Button>
          {canRefund && (
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => onRefund(sale)}
            >
              <Receipt />
              {hasRefunds ? "Refund more" : "Refund"}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}