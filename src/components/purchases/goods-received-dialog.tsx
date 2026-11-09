"use client";

import { useState } from "react";
import { PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  isFullyReceived, remainingQty,
  type PurchaseOrder,
} from "@/types/suppliers";

function buildInitialQuantities(po: PurchaseOrder): Record<string, number> {
  const initial: Record<string, number> = {};
  for (const item of po.items) {
    initial[item.productId] = remainingQty(item);
  }
  return initial;
}

export function GoodsReceivedDialog({
  open,
  onOpenChange,
  po,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  po: PurchaseOrder | null;
  onSubmit: (receivedMap: Record<string, number>) => void;
}) {
  const [received, setReceived] = useState<Record<string, number>>({});

  // Reset quantities when the dialog transitions to open.
  // Doing this in the change handler avoids setState-in-effect.
  function handleOpenChange(next: boolean) {
    if (next && po) {
      setReceived(buildInitialQuantities(po));
    }
    onOpenChange(next);
  }

  if (!po) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent />
      </Dialog>
    );
  }

  // Freeze `po` as non-null for closures below.
  const activePO: PurchaseOrder = po;
  const allReceived = isFullyReceived(activePO);

  function setQty(productId: string, value: number, max: number) {
    const clamped = Math.max(0, Math.min(max, Math.floor(value || 0)));
    setReceived((prev) => ({ ...prev, [productId]: clamped }));
  }

  function submit() {
    const payload: Record<string, number> = {};
    for (const item of activePO.items) {
      const qty = received[item.productId] ?? 0;
      if (qty > 0) payload[item.productId] = qty;
    }
    onSubmit(payload);
    onOpenChange(false);
  }

  const totalReceiving = Object.values(received).reduce((s, v) => s + v, 0);

  // Pre-fill received display from PO if state is empty (first open without
  // any reset trigger). Safe because we only read from `po` here — no setState.
  const displayReceived =
    Object.keys(received).length > 0 ? received : buildInitialQuantities(activePO);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Receive goods — {activePO.id}</DialogTitle>
          <DialogDescription>
            {allReceived
              ? "Every item has already been received in full."
              : "Enter the quantity received for each line. Stock levels update immediately."}
          </DialogDescription>
        </DialogHeader>

        {allReceived ? (
          <p className="rounded-md border border-success/40 bg-success/10 p-4 text-sm text-muted">
            Nothing more to receive. This PO is already fully received.
          </p>
        ) : (
          <div className="space-y-3">
            <ul className="divide-y divide-border overflow-hidden rounded-md border border-border">
              {activePO.items.map((item) => {
                const remaining = remainingQty(item);
                const qty = displayReceived[item.productId] ?? 0;
                return (
                  <li key={item.productId} className="p-3">
                    <div className="mb-2">
                      <p className="text-sm font-medium">{item.productName}</p>
                      <p className="text-[10px] text-muted">
                        {item.sku} · Ordered {item.quantity} · Received {item.receivedQty} · Remaining {remaining}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={remaining}
                        value={qty === 0 ? "" : qty}
                        onChange={(e) => setQty(item.productId, parseInt(e.target.value, 10) || 0, remaining)}
                        placeholder="0"
                        className="h-8 w-24 text-center"
                        aria-label={`Quantity to receive for ${item.productName}`}
                      />
                      <span className="text-[10px] text-muted">of {remaining} remaining</span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <Separator />

            <p className="text-xs text-muted">
              Receiving{" "}
              <strong className="text-foreground">
                {Object.values(displayReceived).reduce((s, v) => s + v, 0)}
              </strong>{" "}
              unit{totalReceiving === 1 ? "" : "s"} total.
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {allReceived ? "Close" : "Cancel"}
          </Button>
          {!allReceived && (
            <Button
              onClick={submit}
              disabled={Object.values(displayReceived).reduce((s, v) => s + v, 0) === 0}
            >
              <PackageCheck />
              Confirm receipt
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}