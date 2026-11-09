"use client";

import { Pencil, Copy, Trash2, ShoppingCart, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
  SheetBody, SheetFooter,
} from "@/components/ui/sheet";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  stockStatusOf, type Category, type Product, type StockMovement,
} from "@/types/inventory";

export function ProductDetailSheet({
  open,
  onOpenChange,
  product,
  categories,
  movements,
  onEdit,
  onAdjust,
  onDuplicate,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  categories: Category[];
  movements: StockMovement[];
  onEdit: (p: Product) => void;
  onAdjust: (p: Product) => void;
  onDuplicate: (p: Product) => void;
  onDelete: (p: Product) => void;
}) {
  if (!product) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent />
      </Sheet>
    );
  }

  const category = categories.find((c) => c.id === product.categoryId);
  const status = stockStatusOf(product);
  const productMovements = movements
    .filter((m) => m.productId === product.id)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 8);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="pr-2">{product.name}</SheetTitle>
          <SheetDescription>
            {product.sku} · {product.brand || "No brand"}
          </SheetDescription>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant={product.status === "active" ? "success" : "muted"}>
              {product.status}
            </Badge>
            {status === "out" && <Badge variant="danger">Out of stock</Badge>}
            {status === "low" && <Badge variant="warning">Low stock</Badge>}
            {status === "in" && <Badge variant="success">In stock</Badge>}
          </div>
        </SheetHeader>

        <SheetBody className="space-y-6">
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Stock
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Current quantity" value={`${product.stockQuantity} ${product.unit}`} />
              <Stat label="Reorder level" value={`${product.reorderLevel} ${product.unit}`} />
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Pricing
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Purchase price" value={formatCurrency(product.purchasePrice)} />
              <Stat label="Selling price" value={formatCurrency(product.sellingPrice)} />
              <Stat
                label="Margin"
                value={
                  product.purchasePrice > 0
                    ? `${Math.round(((product.sellingPrice - product.purchasePrice) / product.sellingPrice) * 100)}%`
                    : "—"
                }
              />
              <Stat label="Tax category" value={product.taxCategory} />
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Details
            </h3>
            <dl className="space-y-1.5 text-sm">
              <Row label="Category" value={category?.name ?? "—"} />
              <Row label="Brand" value={product.brand || "—"} />
              <Row label="Barcode" value={product.barcode || "—"} />
              <Row label="Unit" value={product.unit} />
              <Row
                label="Warehouse"
                value={product.warehouseId === "wh_main" ? "Main warehouse" : "Store front"}
              />
              <Row label="Created" value={formatDate(product.createdAt)} />
              <Row label="Updated" value={formatDate(product.updatedAt)} />
            </dl>
          </section>

          {product.description && (
            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                Description
              </h3>
              <p className="text-sm text-muted">{product.description}</p>
            </section>
          )}

          <section>
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
              <History className="h-3 w-3" />
              Recent movements
            </h3>
            {productMovements.length === 0 ? (
              <p className="text-sm text-muted">No movements recorded for this product.</p>
            ) : (
              <ul className="space-y-2">
                {productMovements.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-start justify-between gap-2 rounded-md border border-border bg-surface/40 px-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium capitalize">{m.type}</p>
                      <p className="truncate text-xs text-muted">
                        {formatDate(m.date, "en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        · {m.reference}
                      </p>
                    </div>
                    <span
                      className={
                        "tabular shrink-0 text-sm font-medium " +
                        (m.quantityDelta > 0 ? "text-success" : "text-danger")
                      }
                    >
                      {m.quantityDelta > 0 ? "+" : ""}
                      {m.quantityDelta}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </SheetBody>

        <SheetFooter className="flex-wrap">
          <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>
            <Pencil />
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onAdjust(product)}>
            <ShoppingCart />
            Adjust stock
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDuplicate(product)}>
            <Copy />
            Duplicate
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-danger [&_svg]:text-danger"
            onClick={() => onDelete(product)}
          >
            <Trash2 />
            Delete
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-surface/40 p-3">
      <p className="text-[11px] uppercase tracking-wider text-muted">{label}</p>
      <p className="tabular mt-0.5 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 py-1.5 last:border-0">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium capitalize">{value}</dd>
    </div>
  );
}