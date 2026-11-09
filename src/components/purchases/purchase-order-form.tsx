"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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
import type { Supplier, PurchaseOrder, PurchaseOrderItem } from "@/types/suppliers";
import type { Product } from "@/types/inventory";

interface DraftItem {
  productId: string;
  quantity: number;
  unitCost: number;
}

const TAX_RATE = 0.1;

function defaultExpectedDelivery(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 14);
  return tomorrow.toISOString().slice(0, 10);
}

export function PurchaseOrderForm({
  open,
  onOpenChange,
  suppliers,
  products,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suppliers: Supplier[];
  products: Product[];
  onSubmit: (po: PurchaseOrder) => void;
}) {
  const [supplierId, setSupplierId] = useState("");
  const [expectedDelivery, setExpectedDelivery] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<DraftItem[]>([]);
  const [error, setError] = useState("");

  // Reset form state when the dialog opens.
  // Handled here (not useEffect) to avoid setState-in-effect.
  function handleOpenChange(next: boolean) {
    if (next) {
      setSupplierId(suppliers.find((s) => s.status === "active")?.id ?? "");
      setExpectedDelivery(defaultExpectedDelivery());
      setNotes("");
      setItems([]);
      setError("");
    }
    onOpenChange(next);
  }

  function addItem() {
    setItems([...items, { productId: "", quantity: 1, unitCost: 0 }]);
  }

  function updateItem(index: number, patch: Partial<DraftItem>) {
    setItems(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitCost, 0);
  const taxAmount = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + taxAmount) * 100) / 100;

  function submit(asDraft: boolean) {
    if (!supplierId) { setError("Select a supplier"); return; }
    if (items.length === 0) { setError("Add at least one item"); return; }

    const invalid = items.find((i) => !i.productId || i.quantity <= 0 || i.unitCost < 0);
    if (invalid) { setError("Complete all item rows"); return; }

    const supplier = suppliers.find((s) => s.id === supplierId);
    if (!supplier) { setError("Supplier not found"); return; }

    const poItems: PurchaseOrderItem[] = items.map((d) => {
      const product = products.find((p) => p.id === d.productId);
      return {
        productId: d.productId,
        productName: product?.name ?? "Unknown",
        sku: product?.sku ?? "",
        quantity: d.quantity,
        receivedQty: 0,
        unitCost: d.unitCost,
        lineTotal: Math.round(d.quantity * d.unitCost * 100) / 100,
      };
    });

    const now = new Date().toISOString();
    const po: PurchaseOrder = {
      id: `PO-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`,
      supplierId,
      supplierName: supplier.name,
      createdAt: now,
      expectedDelivery: expectedDelivery ? new Date(expectedDelivery).toISOString() : now,
      status: asDraft ? "draft" : "pending_approval",
      items: poItems,
      subtotal: Math.round(subtotal * 100) / 100,
      taxAmount,
      total,
      notes,
      createdBy: "Demo User",
    };

    onSubmit(po);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New purchase order</DialogTitle>
          <DialogDescription>
            Add items and choose whether to save as draft or submit for approval.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <Select
                id="supplier"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
              >
                <option value="">Select…</option>
                {suppliers.filter((s) => s.status === "active").map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected">Expected delivery</Label>
              <Input
                id="expected"
                type="date"
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label>Items *</Label>
              <Button type="button" size="sm" variant="secondary" onClick={addItem}>
                <Plus />
                Add item
              </Button>
            </div>

            {items.length === 0 ? (
              <p className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted">
                No items yet. Click &ldquo;Add item&rdquo; to get started.
              </p>
            ) : (
              <ul className="space-y-2">
                {items.map((item, idx) => (
                  <li key={idx} className="grid gap-2 rounded-md border border-border bg-surface/40 p-3 sm:grid-cols-[1fr_80px_100px_auto]">
                    <Select
                      value={item.productId}
                      onChange={(e) => {
                        const product = products.find((p) => p.id === e.target.value);
                        updateItem(idx, {
                          productId: e.target.value,
                          unitCost: product?.purchasePrice ?? 0,
                        });
                      }}
                      aria-label="Product"
                    >
                      <option value="">Select product…</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                      ))}
                    </Select>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(idx, { quantity: parseInt(e.target.value, 10) || 0 })}
                      placeholder="Qty"
                      aria-label="Quantity"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      value={item.unitCost}
                      onChange={(e) => updateItem(idx, { unitCost: parseFloat(e.target.value) || 0 })}
                      placeholder="Unit cost"
                      aria-label="Unit cost"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(idx)}
                      aria-label="Remove item"
                    >
                      <Trash2 />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <Separator />

          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <span className="tabular">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Tax (10%)</span>
              <span className="tabular">{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between font-heading text-base font-semibold">
              <span>Total</span>
              <span className="tabular">{formatCurrency(total)}</span>
            </div>
          </div>

          {error && <p className="text-xs text-danger">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="outline" onClick={() => submit(true)}>
            Save as draft
          </Button>
          <Button onClick={() => submit(false)}>
            Submit for approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}