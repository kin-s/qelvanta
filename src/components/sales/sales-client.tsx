"use client";

import { useState } from "react";
import { ShoppingCart, MoreHorizontal, Eye, Printer, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import { SEED_PRODUCTS, SEED_CATEGORIES, SEED_MOVEMENTS } from "@/data/inventory";
import { SEED_CUSTOMERS, SEED_SALES, TAX_RATE } from "@/data/sales";
import type { Product, Category, StockMovement } from "@/types/inventory";
import type { CartItem, Customer, PaymentMethod, Sale, Refund } from "@/types/sales";
import {
  PAYMENT_METHOD_LABELS, refundedQtyForProduct,
} from "@/types/sales";
import { PosProductGrid } from "./pos-product-grid";
import { PosCart } from "./pos-cart";
import { CheckoutDialog } from "./checkout-dialog";
import { ReceiptDialog } from "./receipt-preview";
import { SaleDetailSheet } from "./sale-detail-sheet";
import { RefundDialog } from "./refund-dialog";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

type Tab = "pos" | "history";

function generateSaleId(): string {
  return `SALE-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
}

function generateMovementId(): string {
  return `mov_${crypto.randomUUID().slice(0, 8)}`;
}

export function SalesClient() {
  const [products, setProducts] = useLocalStorageState<Product[]>(
    "bizflow:products",
    SEED_PRODUCTS
  );
  const [categories] = useLocalStorageState<Category[]>(
    "bizflow:categories",
    SEED_CATEGORIES
  );
  const [movements, setMovements] = useLocalStorageState<StockMovement[]>(
    "bizflow:stock-movements",
    SEED_MOVEMENTS
  );
  const [customers] = useLocalStorageState<Customer[]>(
    "bizflow:customers",
    SEED_CUSTOMERS
  );
  const [sales, setSales] = useLocalStorageState<Sale[]>(
    "bizflow:sales",
    SEED_SALES
  );

  const [tab, setTab] = useState<Tab>("pos");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [discountPct, setDiscountPct] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptSale, setReceiptSale] = useState<Sale | null>(null);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [refundSaleId, setRefundSaleId] = useState<string | null>(null);

  const selectedSale = selectedSaleId
    ? sales.find((s) => s.id === selectedSaleId) ?? null
    : null;
  const refundSale = refundSaleId
    ? sales.find((s) => s.id === refundSaleId) ?? null
    : null;

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

  function completeSale(paymentMethod: PaymentMethod) {
    const saleId = generateSaleId();
    const now = new Date().toISOString();

    const saleItems = cart.map((c) => ({
      productId: c.productId,
      name: c.name,
      sku: c.sku,
      unitPrice: c.unitPrice,
      quantity: c.quantity,
      lineTotal: Math.round(c.unitPrice * c.quantity * 100) / 100,
    }));

    const sale: Sale = {
      id: saleId,
      createdAt: now,
      customerId: customer?.id,
      customerName: customer?.name ?? "Walk-in customer",
      items: saleItems,
      subtotal: Math.round(cartTotal * 100) / 100,
      discountPct,
      discountAmount,
      taxAmount,
      total: finalTotal,
      paymentMethod,
      cashier: "Demo User",
      status: "completed",
      refunds: [],
    };

    const updatedProducts = products.map((p) => {
      const item = cart.find((c) => c.productId === p.id);
      if (!item) return p;
      return {
        ...p,
        stockQuantity: Math.max(0, p.stockQuantity - item.quantity),
        updatedAt: now,
      };
    });
    setProducts(updatedProducts);

    const newMovements: StockMovement[] = cart.map((c) => {
      const product = products.find((p) => p.id === c.productId);
      const source = product?.warehouseId === "wh_main" ? "Main warehouse" : "Store front";
      return {
        id: generateMovementId(),
        productId: c.productId,
        productName: c.name,
        type: "sold",
        quantityDelta: -c.quantity,
        sourceLocation: source,
        destinationLocation: sale.customerName,
        reference: saleId,
        date: now,
        user: "Demo User",
        status: "completed",
      };
    });
    setMovements([...newMovements, ...movements]);

    setSales([sale, ...sales]);

    setCart([]);
    setDiscountPct(0);
    setCustomer(null);
    setCheckoutOpen(false);
    setMobileCartOpen(false);
    setReceiptSale(sale);
    setReceiptOpen(true);

    toast.success("Sale complete", {
      description: `${sale.id} · ${formatCurrency(sale.total)}`,
    });
  }

  function processRefund(refund: Refund) {
    if (!refundSale) return;
    const now = refund.createdAt;

    // 1. Update the sale with the new refund, recalculate status
    const updatedSales = sales.map((s) => {
      if (s.id !== refundSale.id) return s;
      const nextRefunds = [...(s.refunds ?? []), refund];
      // Compute remaining refundable qty
      const remaining = s.items.reduce((sum, item) => {
        const refundedAll = nextRefunds.reduce((rs, r) => {
          const it = r.items.find((i) => i.productId === item.productId);
          return rs + (it?.quantity ?? 0);
        }, 0);
        return sum + Math.max(0, item.quantity - refundedAll);
      }, 0);
      const status: Sale["status"] =
        remaining === 0 ? "refunded" : "partially_refunded";
      return { ...s, refunds: nextRefunds, status };
    });
    setSales(updatedSales);

    // 2. Add stock back
    const updatedProducts = products.map((p) => {
      const refundItem = refund.items.find((i) => i.productId === p.id);
      if (!refundItem) return p;
      return {
        ...p,
        stockQuantity: p.stockQuantity + refundItem.quantity,
        updatedAt: now,
      };
    });
    setProducts(updatedProducts);

    // 3. Create return movements
    const newMovements: StockMovement[] = refund.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const destination = product?.warehouseId === "wh_main" ? "Main warehouse" : "Store front";
      return {
        id: generateMovementId(),
        productId: item.productId,
        productName: item.name,
        type: "returned",
        quantityDelta: item.quantity,
        sourceLocation: refundSale.customerName,
        destinationLocation: destination,
        reference: `${refund.id} · ${refundSale.id}`,
        date: now,
        user: "Demo User",
        status: "completed",
        notes: refund.reasonNote,
      };
    });
    setMovements([...newMovements, ...movements]);

    setRefundSaleId(null);
    toast.success("Refund recorded", {
      description: `${refund.id} · ${formatCurrency(refund.amount)}`,
    });
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
            <span className="text-xs">Demo — no payment is processed.</span>
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
                  customers={customers}
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
                  customers={customers}
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
                    <TableHead className="hidden md:table-cell text-right">Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="hidden sm:table-cell">Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10 text-right"><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyRows.map((s) => {
                    const refundable = s.items.some(
                      (i) => i.quantity - refundedQtyForProduct(s, i.productId) > 0
                    );
                    return (
                      <TableRow key={s.id}>
                        <TableCell>
                          <button
                            type="button"
                            onClick={() => setSelectedSaleId(s.id)}
                            className="tabular text-xs font-medium text-accent hover:underline"
                          >
                            {s.id}
                          </button>
                        </TableCell>
                        <TableCell className="truncate">{s.customerName}</TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted">
                          {formatDate(s.createdAt, "en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell className="tabular hidden md:table-cell text-right">
                          {s.items.length}
                        </TableCell>
                        <TableCell className="tabular text-right font-medium">
                          {formatCurrency(s.total)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs text-muted">
                          {PAYMENT_METHOD_LABELS[s.paymentMethod]}
                        </TableCell>
                        <TableCell>
                          {s.status === "completed" && <Badge variant="success">Completed</Badge>}
                          {s.status === "partially_refunded" && <Badge variant="warning">Partial refund</Badge>}
                          {s.status === "refunded" && <Badge variant="danger">Refunded</Badge>}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" aria-label={`Actions for ${s.id}`}>
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>{s.id}</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => setSelectedSaleId(s.id)}>
                                <Eye /> View details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setReceiptSale(s);
                                  setReceiptOpen(true);
                                }}
                              >
                                <Printer /> Reprint receipt
                              </DropdownMenuItem>
                              {refundable && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-danger [&_svg]:text-danger"
                                    onClick={() => setRefundSaleId(s.id)}
                                  >
                                    <RotateCcw /> Refund
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          )}
          <p className="text-center text-xs text-muted">
            Click a sale ID or the ⋮ menu to view details, reprint, or refund.
          </p>
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

      <SaleDetailSheet
        open={!!selectedSaleId}
        onOpenChange={(o) => !o && setSelectedSaleId(null)}
        sale={selectedSale}
        onReprint={(sale) => {
          setReceiptSale(sale);
          setReceiptOpen(true);
        }}
        onRefund={(sale) => setRefundSaleId(sale.id)}
      />

      <RefundDialog
        open={!!refundSaleId}
        onOpenChange={(o) => !o && setRefundSaleId(null)}
        sale={refundSale}
        onSubmit={processRefund}
      />
    </div>
  );
}