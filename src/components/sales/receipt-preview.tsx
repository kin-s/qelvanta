"use client";

import { Printer, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PAYMENT_METHOD_LABELS, type Sale } from "@/types/sales";

export function ReceiptDialog({
  open,
  onOpenChange,
  sale,
  onNewSale,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: Sale | null;
  onNewSale: () => void;
}) {
  if (!sale) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent />
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Receipt</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="mt-3 font-heading text-lg font-semibold">Sale complete</p>
          <p className="mt-1 text-xs text-muted">
            {sale.id} · {formatDate(sale.createdAt, "en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="rounded-md border border-border bg-surface/40 p-4">
          <div className="text-center">
            <p className="font-heading text-sm font-semibold">QELVANTA</p>
            <p className="text-[10px] text-muted">Demo Receipt</p>
          </div>

          <Separator className="!my-3" />

          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted">Customer</span>
              <span className="text-foreground">{sale.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Cashier</span>
              <span className="text-foreground">{sale.cashier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Payment</span>
              <span className="text-foreground">{PAYMENT_METHOD_LABELS[sale.paymentMethod]}</span>
            </div>
          </div>

          <Separator className="!my-3" />

          <ul className="space-y-2 text-xs">
            {sale.items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.name}</p>
                  <p className="text-[10px] text-muted">
                    {item.quantity} × {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                <span className="tabular shrink-0">{formatCurrency(item.lineTotal)}</span>
              </li>
            ))}
          </ul>

          <Separator className="!my-3" />

          <div className="space-y-1 text-xs">
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
            <Separator className="!my-2" />
            <div className="flex justify-between font-heading text-sm font-semibold">
              <span>Total</span>
              <span className="tabular">{formatCurrency(sale.total)}</span>
            </div>
          </div>

          <Separator className="!my-3" />

          <p className="text-center text-[10px] text-muted">
            Thank you for your business!
            <br />
            This is a demonstration receipt — no payment was processed.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => window.print()}
          >
            <Printer />
            Print
          </Button>
          <Button className="flex-1" onClick={onNewSale}>
            <X className="hidden" />
            New sale
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}