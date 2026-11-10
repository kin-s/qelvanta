"use client";

import { useState } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { SEED_CUSTOMERS, TAX_RATE } from "@/data/sales";
import type { Product, Category } from "@/types/inventory";
import type { CartItem, Customer, PaymentMethod, Sale } from "@/types/sales";
import { PAYMENT_METHOD_LABELS } from "@/types/sales";
import { PosProductGrid } from "./pos-product-grid";
import { PosCart } from "./pos-cart";
import { CheckoutDialog } from "./checkout-dialog";
import { ReceiptDialog } from "./receipt-preview";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { createSale } from "@/actions/sales";
import { SEED_CATEGORIES } from "@/data/inventory";

type Tab = "pos" | "history";

export function SalesClient({ 
  initialProducts, 
  initialSales 
}: { 
  initialProducts: Product[]; 
  initialSales: Sale[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [categories] = useState<Category[]>(SEED_CATEGORIES);

  const [tab, setTab] = useState<Tab>("pos");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [discountPct, setDiscountPct] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptSale, setReceiptSale] = useState<Sale | null>(null);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const discountAmount = Math.round(cartTotal * discountPct) / 100;
  const taxable = cartTotal - discountAmount;
  const taxAmount = Math.round(taxable * TAX_RATE * 100) / 100;
  const finalTotal = Math.round((taxable + taxAmount) * 100) / 100;

  function addToCart(product: Product) {
    const existing = cart.find((c) => c.productId === product.id);
    if (existing) {
      if (existing.quantity >= product.stockQuantity) {
        toast.error("Not enough stock", {
          description: `Only ${product.stockQuantity} ${product.unit} of ${product.name} available.`,
        });
        return;
      }
      setCart(
        cart.map((c) =>
          c.productId === product.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      if (product.stockQuantity <= 0) {
        toast.error("Out of stock", { description: product.name });
        return;
      }
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          unitPrice: product.sellingPrice,
          quantity: 1,
        },
      ]);
    }
  }

  function updateQty(productId: string, qty: number) {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (product && qty > product.stockQuantity) {
      toast.error("Not enough stock");
      return;
    }
    setCart(cart.map((c) => (c.productId === productId ? { ...c, quantity: qty } : c)));
  }

  function removeItem(productId: string) {
    setCart(cart.filter((c) => c.productId !== productId));
  }

  function clearCart() {
    setCart([]);
    setDiscountPct(0);
    setCustomer(null);
  }

  async function completeSale(paymentMethod: PaymentMethod) {
    setIsSubmitting(true);
    
    // Call the Server Action
    const res = await createSale({
      cart,
      customerId: customer?.id,
      discountAmount,
      taxAmount,
      total: finalTotal,
      paymentMethod
    });

    setIsSubmitting(false);

    if (res.error) {
      toast.error("Checkout failed", { description: res.error });
      return;
    }

    // Optimistically update local UI
    const mockSale: Sale = {
      id: res.saleId || `SALE-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      customerId: customer?.id,
      customerName: customer?.name ?? "Walk-in customer",
      items: cart.map(c => ({
        productId: c.productId, name: c.name, sku: c.sku,
        unitPrice: c.unitPrice, quantity: c.quantity, lineTotal: c.unitPrice * c.quantity
      })),
      subtotal: cartTotal,
      discountPct,
      discountAmount,
      taxAmount,
      total: finalTotal,
      paymentMethod,
      cashier: "Admin",
      status: "completed",
      refunds: [],
    };

    setSales([mockSale, ...sales]);
    
    // Update local product stock so POS reflects the change immediately
    setProducts(products.map(p => {
      const cartItem = cart.find(c => c.productId === p.id);
      if (!cartItem) return p;
      return { ...p, stockQuantity: p.stockQuantity - cartItem.quantity };
    }));

    setCart([]);
    setDiscountPct(0);
    setCustomer(null);
    setCheckoutOpen(false);
    setMobileCartOpen(false);
    setReceiptSale(mockSale);
    setReceiptOpen(true);

    toast.success("Sale completed", { description: mockSale.id });
  }

  const historyRows = [...sales].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Sales & POS
          </h1>
          <p className="mt-1 text-sm text-muted">
            Fast point of sale and complete sales history.{" "}
            <span className="text-xs text-success">Connected to PostgreSQL.</span>
          </p>
        </div>
      </div>

      <div role="tablist" className="flex gap-1 border-b border-border">
        {[
          { id: "pos" as const, label: "POS" },
          { id: "history" as const, label: "Sales history", count: sales.length },
        ].map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              tab === t.id
                ? "border-accent text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span className="ml-1.5 rounded-full bg-surface px-1.5 py-0.5 text-[10px] text-muted">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "pos" && (
        <>
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="min-w-0">
              <PosProductGrid
                products={products}
                categories={categories}
                onAdd={addToCart}
              />
            </div>
            <aside className="hidden lg:block">
              <Card className="sticky top-20 flex h-[calc(100vh-6rem)] flex-col overflow-hidden">
                <PosCart
                  cart={cart}
                  products={products}
                  customers={SEED_CUSTOMERS}
                  customer={customer}
                  discountPct={discountPct}
                  taxRate={TAX_RATE}
                  onQtyChange={updateQty}
                  onRemove={removeItem}
                  onClear={clearCart}
                  onCustomerChange={setCustomer}
                  onDiscountChange={setDiscountPct}
                  onCheckout={() => setCheckoutOpen(true)}
                  onAddToCart={(productId) => {
                    const p = products.find((x) => x.id === productId);
                    if (p) addToCart(p);
                  }}
                />
              </Card>
            </aside>
          </div>

          {itemCount > 0 && (
            <button
              type="button"
              onClick={() => setMobileCartOpen(true)}
              className="fixed bottom-20 right-4 z-30 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-medium text-[#111111] shadow-xl transition-transform hover:scale-105 active:scale-95 lg:hidden"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart · {itemCount} · {formatCurrency(finalTotal)}
            </button>
          )}

          <Sheet open={mobileCartOpen} onOpenChange={setMobileCartOpen}>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader className="pr-10">
                <SheetTitle>Cart</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-hidden">
                <PosCart
                  cart={cart}
                  products={products}
                  customers={SEED_CUSTOMERS}
                  customer={customer}
                  discountPct={discountPct}
                  taxRate={TAX_RATE}
                  onQtyChange={updateQty}
                  onRemove={removeItem}
                  onClear={clearCart}
                  onCustomerChange={setCustomer}
                  onDiscountChange={setDiscountPct}
                  onCheckout={() => setCheckoutOpen(true)}
                  onAddToCart={(productId) => {
                    const p = products.find((x) => x.id === productId);
                    if (p) addToCart(p);
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}

      {tab === "history" && (
        <div className="space-y-4">
          {historyRows.length === 0 ? (
            <Card className="border-dashed p-12 text-center">
              <p className="text-sm text-muted">No sales recorded yet.</p>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sale ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="hidden sm:table-cell">Payment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyRows.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="tabular text-xs font-medium">{s.id.slice(0, 8)}...</TableCell>
                      <TableCell className="truncate">{s.customerName}</TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted">
                        {formatDate(s.createdAt, "en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="tabular text-right">{s.items.length}</TableCell>
                      <TableCell className="tabular text-right font-medium">
                        {formatCurrency(s.total)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-xs text-muted">
                        {PAYMENT_METHOD_LABELS[s.paymentMethod]}
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">{s.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      )}

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        cart={cart}
        customer={customer}
        discountPct={discountPct}
        taxRate={TAX_RATE}
        onConfirm={completeSale}
      />

      <ReceiptDialog
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        sale={receiptSale}
        onNewSale={() => {
          setReceiptOpen(false);
          setReceiptSale(null);
        }}
      />
    </div>
  );
}