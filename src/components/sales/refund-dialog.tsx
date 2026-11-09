"use client";

import { useState } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import {
  REFUND_METHOD_LABELS, REFUND_REASON_LABELS,
  refundedQtyForProduct,
  type Refund, type RefundMethod, type RefundReason, type Sale,
} from "@/types/sales";

const REASONS: RefundReason[] = [
  "defective",
  "wrong_item",
  "not_as_described",
  "no_longer_needed",
  "other",
];

const METHODS: RefundMethod[] = ["original", "cash", "store_credit"];

export function RefundDialog({
  open,
  onOpenChange,
  sale,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: Sale | null;
  onSubmit: (refund: Refund) => void;
}) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [reason, setReason] = useState<RefundReason>("defective");
  const [reasonNote, setReasonNote] = useState("");
  const [method, setMethod] = useState<RefundMethod>("original");
  const [error, setError] = useState("");

  function handleOpenChange(next: boolean) {
    if (next) {
      setQuantities({});
      setReason("defective");
      setReasonNote("");
      setMethod("original");
      setError("");
    }
    onOpenChange(next);
  }

  if (!sale) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent />
      </Dialog>
    );
  }

  const effectiveRate = sale.subtotal > 0 ? sale.total / sale.subtotal : 1;

  const refundableItems = sale.items
    .map((item) => {
      const already = refundedQtyForProduct(sale, item.productId);
      return { ...item, refundable: item.quantity - already };
    })
    .filter((i) => i.refundable > 0);

  const allFullyRefunded = refundableItems.length === 0;

  const totalToRefund =
    Math.round(
      refundableItems.reduce(
        (sum, item) => sum + (quantities[item.productId] ?? 0) * item.unitPrice,
        0
      ) *
        effectiveRate *
        100
    ) / 100;

  function setQty(productId: string, value: number, max: number) {
    const clamped = Math.max(0, Math.min(max, Math.floor(value || 0)));
    setQuantities((prev) => ({ ...prev, [productId]: clamped }));
    setError("");
  }

  function submit() {
    const items = refundableItems
      .filter((i) => (quantities[i.productId] ?? 0) > 0)
      .map((i) => {
        const qty = quantities[i.productId] ?? 0;
        const lineRefund = Math.round(qty * i.unitPrice * effectiveRate * 100) / 100;
        return {
          productId: i.productId,
          name: i.name,
          quantity: qty,
          unitPrice: i.unitPrice,
          lineRefund,
        };
      });

    if (items.length === 0) {
      setError("Select at least one item and quantity to refund.");
      return;
    }

    const refund: Refund = {
      id: `REF-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      items,
      amount: totalToRefund,
      reason,
      reasonNote: reasonNote.trim() || undefined,
      method,
      cashier: "Demo User",
    };

    onSubmit(refund);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Refund sale {sale.id}</DialogTitle>
          <DialogDescription>
            Choose items to refund, then confirm. Stock is added back automatically. This is a demo — no payment is actually reversed.
          </DialogDescription>
        </DialogHeader>

        {allFullyRefunded ? (
          <div className="rounded-md border border-warning/40 bg-warning/10 p-4 text-sm">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              <div>
                <p className="font-medium text-warning">Already fully refunded</p>
                <p className="mt-1 text-muted">
                  Every item on this sale has already been refunded. There is nothing left to refund.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
                Items to refund
              </p>
              <div className="overflow-hidden rounded-md border border-border">
                <ul className="divide-y divide-border">
                  {refundableItems.map((item) => {
                    const qty = quantities[item.productId] ?? 0;
                    return (
                      <li key={item.productId} className="flex items-center gap-3 p-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{item.name}</p>
                          <p className="text-[10px] text-muted">
                            {formatCurrency(item.unitPrice)} each · {item.refundable} refundable
                          </p>
                        </div>
                        <div className="flex w-24 items-center gap-1.5">
                          <Input
                            type="number"
                            min={0}
                            max={item.refundable}
                            value={qty === 0 ? "" : qty}
                            onChange={(e) =>
                              setQty(
                                item.productId,
                                parseInt(e.target.value, 10) || 0,
                                item.refundable
                              )
                            }
                            placeholder="0"
                            className="h-8 text-center"
                            aria-label={`Refund quantity for ${item.name}`}
                          />
                          <span className="text-[10px] text-muted">/ {item.refundable}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="refundReason" className="text-xs">Reason *</Label>
                <Select
                  id="refundReason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value as RefundReason)}
                >
                  {REASONS.map((r) => (
                    <option key={r} value={r}>{REFUND_REASON_LABELS[r]}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="refundMethod" className="text-xs">Refund to</Label>
                <Select
                  id="refundMethod"
                  value={method}
                  onChange={(e) => setMethod(e.target.value as RefundMethod)}
                >
                  {METHODS.map((m) => (
                    <option key={m} value={m}>{REFUND_METHOD_LABELS[m]}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="refundNote" className="text-xs">Notes</Label>
              <Textarea
                id="refundNote"
                rows={2}
                value={reasonNote}
                onChange={(e) => setReasonNote(e.target.value)}
                placeholder="Optional — explain the reason in more detail"
              />
            </div>

            <Separator />

            <div className="flex justify-between text-sm">
              <span className="font-medium">Refund amount</span>
              <span className="tabular font-heading text-lg font-semibold text-danger">
                {formatCurrency(totalToRefund)}
              </span>
            </div>

            {error && <p className="text-xs text-danger">{error}</p>}
          </div>
        )}

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {allFullyRefunded ? "Close" : "Cancel"}
          </Button>
          {!allFullyRefunded && (
            <Button
              variant="destructive"
              onClick={submit}
              disabled={totalToRefund <= 0}
            >
              <RotateCcw />
              Confirm refund
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}