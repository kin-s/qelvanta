"use client";

import { Minus, Plus, Trash2, ShoppingCart, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CustomerPicker } from "./customer-picker";
import { formatCurrency } from "@/lib/utils";
import type { CartItem, Customer } from "@/types/sales";
import type { Product } from "@/types/inventory";

export function PosCart({
  cart,
  products,
  customers,
  customer,
  discountPct,
  taxRate,
  onQtyChange,
  onRemove,
  onClear,
  onCustomerChange,
  onDiscountChange,
  onCheckout,
  onAddToCart,
}: {
  cart: CartItem[];
  products: Product[];
  customers: Customer[];
  customer: Customer | null;
  discountPct: number;
  taxRate: number;
  onQtyChange: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
  onCustomerChange: (c: Customer | null) => void;
  onDiscountChange: (pct: number) => void;
  onCheckout: () => void;
  onAddToCart: (productId: string) => void;
}) {
  const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const discountAmount = Math.round(subtotal * discountPct) / 100;
  const taxable = subtotal - discountAmount;
  const taxAmount = Math.round(taxable * taxRate * 100) / 100;
  const total = Math.round((taxable + taxAmount) * 100) / 100;

  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);
  const isEmpty = cart.length === 0;

  function handleAddMore(productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const current = cart.find((c) => c.productId === productId);
    const currQty = current?.quantity ?? 0;
    if (currQty >= product.stockQuantity) return;
    onAddToCart(productId);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-border p-4">
        <div>
          <h2 className="font-heading text-base font-semibold">Cart</h2>
          <p className="text-xs text-muted">
            {isEmpty
              ? "No items yet"
              : `${itemCount} item${itemCount === 1 ? "" : "s"} · ${cart.length} line${cart.length === 1 ? "" : "s"}`}
          </p>
        </div>
        {!isEmpty && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <Trash2 />
            Clear
          </Button>
        )}
      </div>

      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-muted">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <p className="text-sm text-muted">Click a product to add it to the cart.</p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto">
            <ul className="divide-y divide-border">
              {cart.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                const canInc = product ? item.quantity < product.stockQuantity : false;
                return (
                  <li key={item.productId} className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.name}</p>
                        <p className="text-[10px] text-muted">
                          {item.sku} · {formatCurrency(item.unitPrice)} each
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(item.productId)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-danger"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-0.5 rounded-md border border-border">
                        <button
                          type="button"
                          onClick={() => onQtyChange(item.productId, item.quantity - 1)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-l-md text-muted hover:bg-surface hover:text-foreground"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="tabular inline-flex h-7 min-w-[2rem] items-center justify-center px-1 text-xs font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={!canInc}
                          onClick={() => handleAddMore(item.productId)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-r-md text-muted hover:bg-surface hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="tabular text-sm font-medium">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="border-t border-border p-4">
            <div className="mb-3">
              <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-muted">
                Customer
              </label>
              <CustomerPicker
                customers={customers}
                value={customer}
                onChange={onCustomerChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="discount" className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-muted">
                Discount (%)
              </label>
              <Input
                id="discount"
                type="number"
                min={0}
                max={100}
                value={discountPct === 0 ? "" : discountPct}
                onChange={(e) => {
                  const raw = parseFloat(e.target.value);
                  const pct = isNaN(raw) ? 0 : Math.min(100, Math.max(0, raw));
                  onDiscountChange(pct);
                }}
                placeholder="0"
                className="h-9"
              />
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

            <Button className="mt-4 w-full" size="lg" onClick={onCheckout}>
              <UserIcon />
              Checkout · {formatCurrency(total)}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}