"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import { SEED_CATEGORIES, SEED_MOVEMENTS, SEED_PRODUCTS } from "@/data/inventory";
import type { Category, Product, StockMovement } from "@/types/inventory";
import { InventoryOverview } from "./inventory-overview";
import { ProductTable } from "./product-table";
import { ProductForm } from "./product-form";
import { DeleteDialog } from "./delete-dialog";
import { CategoryManager } from "./category-manager";
import { AdjustStockDialog, type AdjustStockInitial } from "./adjust-stock-dialog";
import { StockMovementTable } from "./stock-movement-table";
import { LowStockTable, suggestedReorderQuantity } from "./low-stock-table";
import { ProductDetailSheet } from "./product-detail-sheet";
import { cn } from "@/lib/utils";

type Tab = "overview" | "products" | "categories" | "movements" | "low-stock";

function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

export function InventoryClient() {
  const [products, setProducts] = useLocalStorageState<Product[]>(
    "bizflow:products",
    SEED_PRODUCTS
  );
  const [categories, setCategories] = useLocalStorageState<Category[]>(
    "bizflow:categories",
    SEED_CATEGORIES
  );
  const [movements, setMovements] = useLocalStorageState<StockMovement[]>(
    "bizflow:stock-movements",
    SEED_MOVEMENTS
  );

  const [tab, setTab] = useState<Tab>("overview");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustInitial, setAdjustInitial] = useState<AdjustStockInitial | undefined>();
  const [viewing, setViewing] = useState<Product | null>(null);

  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) counts[p.categoryId] = (counts[p.categoryId] ?? 0) + 1;
    return counts;
  }, [products]);

  const lowStockCount = useMemo(
    () =>
      products.filter((p) => p.stockQuantity <= 0 || p.stockQuantity <= p.reorderLevel)
        .length,
    [products]
  );

  function openAdd() { setEditing(null); setFormOpen(true); }
  function openEdit(p: Product) { setEditing(p); setFormOpen(true); setViewing(null); }
  function openAdjust(p?: Product, qty?: number) {
    setViewing(null);
    setAdjustInitial(p ? { productId: p.id, type: "received", quantity: qty ?? suggestedReorderQuantity(p) } : undefined);
    setAdjustOpen(true);
  }

  function submitProduct(input: Product) {
    const product = input.id ? input : { ...input, id: generateId("prod") };
    const exists = products.some((x) => x.id === product.id);
    if (exists) {
      setProducts(products.map((x) => (x.id === product.id ? product : x)));
      toast.success("Product updated");
    } else {
      setProducts([...products, product]);
      toast.success("Product added");
    }
    setFormOpen(false);
    setEditing(null);
  }

  function duplicateProduct(p: Product) {
    const now = new Date().toISOString();
    const copy: Product = {
      ...p,
      id: generateId("prod"),
      name: `${p.name} (copy)`,
      sku: `${p.sku}-COPY`,
      stockQuantity: 0,
      createdAt: now,
      updatedAt: now,
    };
    setProducts([...products, copy]);
    setViewing(null);
    toast.success("Product duplicated", { description: copy.name });
  }

  function deleteProduct(p: Product) {
    setProducts(products.filter((x) => x.id !== p.id));
    setDeleteTarget(null);
    setViewing(null);
    toast.success("Product deleted");
  }

  function bulkDelete(ids: string[]) {
    setBulkDeleteIds(ids);
    setBulkDeleteOpen(true);
  }

  function confirmBulkDelete() {
    setProducts(products.filter((p) => !bulkDeleteIds.includes(p.id)));
    toast.success(`${bulkDeleteIds.length} products deleted`);
    setBulkDeleteOpen(false);
    setBulkDeleteIds([]);
  }

  function recordMovement(m: StockMovement) {
    setMovements([m, ...movements]);
    setProducts(
      products.map((p) => {
        if (p.id !== m.productId) return p;
        const nextQty = Math.max(0, p.stockQuantity + m.quantityDelta);
        return { ...p, stockQuantity: nextQty, updatedAt: new Date().toISOString() };
      })
    );
    toast.success("Stock movement recorded", {
      description: `${m.productName} · ${m.quantityDelta > 0 ? "+" : ""}${m.quantityDelta}`,
    });
    if (viewing && viewing.id === m.productId) {
      setViewing({
        ...viewing,
        stockQuantity: Math.max(0, viewing.stockQuantity + m.quantityDelta),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  function reorderFromLowStock(p: Product, qty: number) {
    openAdjust(p, qty);
  }

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "products", label: "Products", count: products.length },
    { id: "movements", label: "Movements", count: movements.length },
    { id: "low-stock", label: "Low stock", count: lowStockCount },
    { id: "categories", label: "Categories", count: categories.length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Inventory
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage products, stock, and categories across locations.{" "}
            <span className="text-xs">Demo data — changes persist locally.</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => openAdjust()}>
            <Plus />
            Adjust stock
          </Button>
          <Button onClick={openAdd}>
            <Plus />
            Add product
          </Button>
        </div>
      </div>

      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              tab === t.id
                ? "border-accent text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            )}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span className={cn(
                "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]",
                t.id === "low-stock" && t.count > 0
                  ? "bg-warning/20 text-warning"
                  : "bg-surface text-muted"
              )}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "overview" && <InventoryOverview products={products} categories={categories} />}

      {tab === "products" && (
        <ProductTable
          products={products}
          categories={categories}
          onEdit={openEdit}
          onDuplicate={duplicateProduct}
          onDelete={(p) => setDeleteTarget(p)}
          onBulkDelete={bulkDelete}
          onView={(p) => setViewing(p)}
        />
      )}

      {tab === "movements" && (
        <StockMovementTable
          movements={movements}
          onRecord={() => openAdjust()}
        />
      )}

      {tab === "low-stock" && (
        <LowStockTable products={products} onReorder={reorderFromLowStock} />
      )}

      {tab === "categories" && (
        <CategoryManager
          categories={categories}
          productCounts={productCounts}
          onCreate={(c) => setCategories([...categories, c])}
          onDelete={(id) => {
            setCategories(categories.filter((c) => c.id !== id));
            toast.success("Category deleted");
          }}
        />
      )}

      {/* Dialogs and sheet */}
      <ProductForm
        open={formOpen}
        onOpenChange={(o) => { setFormOpen(o); if (!o) setEditing(null); }}
        product={editing}
        categories={categories}
        onSubmit={submitProduct}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.name ?? ""}"?`}
        description="This will remove the product from your catalogue. You cannot undo this action."
        onConfirm={() => deleteTarget && deleteProduct(deleteTarget)}
      />

      <DeleteDialog
        open={bulkDeleteOpen}
        onOpenChange={(o) => !o && setBulkDeleteOpen(false)}
        title={`Delete ${bulkDeleteIds.length} products?`}
        description="All selected products will be permanently removed. You cannot undo this action."
        onConfirm={confirmBulkDelete}
      />

      <AdjustStockDialog
        open={adjustOpen}
        onOpenChange={setAdjustOpen}
        products={products}
        initial={adjustInitial}
        onSubmit={recordMovement}
      />

      <ProductDetailSheet
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
        product={viewing}
        categories={categories}
        movements={movements}
        onEdit={openEdit}
        onAdjust={(p) => openAdjust(p)}
        onDuplicate={duplicateProduct}
        onDelete={(p) => { setViewing(null); setDeleteTarget(p); }}
      />
    </div>
  );
}