"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { PaymentMethodPicker } from "./payment-method-picker";
import { formatCurrency } from "@/lib/utils";
import type { CartItem, Customer, PaymentMethod } from "@/types/sales";

export function CheckoutDialog({
  open,
  onOpenChange,
  cart,
  customer,
  discountPct,
  taxRate,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  customer: Customer | null;
  discountPct: number;
  taxRate: number;
  onConfirm: (paymentMethod: PaymentMethod) => void;
}) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

  // Reset to default whenever the dialog transitions to open.
  // Resetting inside the openChange handler (event handler) avoids the
  // setState-in-effect rule and prevents one extra render cycle.
  function handleOpenChange(next: boolean) {
    if (next) setPaymentMethod("cash");
    onOpenChange(next);
  }

  const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const discountAmount = Math.round(subtotal * discountPct) / 100;
  const taxable = subtotal - discountAmount;
  const taxAmount = Math.round(taxable * taxRate * 100) / 100;
  const total = Math.round((taxable + taxAmount) * 100) / 100;
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm sale</DialogTitle>
          <DialogDescription>
            Review the order and choose a payment method. This is a demo — no payment is actually processed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md border border-border bg-surface/60 p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Customer</span>
              <span className="font-medium">{customer?.name ?? "Walk-in customer"}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-muted">Items</span>
              <span className="tabular font-medium">{itemCount}</span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted">
              Payment method
            </p>
            <PaymentMethodPicker value={paymentMethod} onChange={setPaymentMethod} />
          </div>

          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <span className="tabular">{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-muted">
                <span>Discount ({discountPct}%)</span>
                <span className="tabular">−{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted">
              <span>Tax ({Math.round(taxRate * 100)}%)</span>
              <span className="tabular">{formatCurrency(taxAmount)}</span>
            </div>
            <Separator className="!my-2" />
            <div className="flex justify-between font-heading text-base font-semibold">
              <span>Total</span>
              <span className="tabular">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onConfirm(paymentMethod)}>
            Complete sale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}