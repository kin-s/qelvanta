"use client";

import { useMemo, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import { SEED_CATEGORIES } from "@/data/inventory";
import type { Category, Product } from "@/types/inventory";
import { InventoryOverview } from "./inventory-overview";
import { ProductTable } from "./product-table";
import { ProductForm } from "./product-form";
import { DeleteDialog } from "./delete-dialog";
import { CategoryManager } from "./category-manager";
import { AdjustStockDialog, type AdjustStockInitial } from "./adjust-stock-dialog";
import { StockMovementTable } from "./stock-movement-table";
import { LowStockTable, suggestedReorderQuantity } from "./low-stock-table";
import { ProductDetailSheet } from "./product-detail-sheet";
import { createProduct } from "@/actions/inventory";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Tab = "overview" | "products" | "movements" | "low-stock" | "categories";

export function InventoryClient({ initialProducts }: { initialProducts: Product[] }) {
  // We keep categories in local storage for now, but products are from DB
  const [categories] = useLocalStorageState<Category[]>(
    "bizflow:categories",
    SEED_CATEGORIES
  );
  // Movements are still mocked locally for this phase
  const [movements, setMovements] = useLocalStorageState<any[]>(
    "bizflow:stock-movements",
    []
  );

  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  
  const [tab, setTab] = useState<Tab>("overview");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustInitial, setAdjustInitial] = useState<AdjustStockInitial | undefined>();
  const [viewing, setViewing] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function submitProduct(input: Product) {
    if (input.id) {
      // Edit product logic (to be implemented in next phase)
      toast.error("Editing products is coming in the next update!");
      return;
    }

    setIsSubmitting(true);
    // Call the Server Action
    const res = await createProduct(input);
    setIsSubmitting(false);

    if (res.error) {
      toast.error("Failed to create product", { description: res.error });
      return;
    }

    if (res.product) {
      setProducts([res.product, ...products]);
      toast.success("Product saved to database!");
    }
    
    setFormOpen(false);
    setEditing(null);
    router.refresh(); // Refresh server data
  }

  function duplicateProduct(p: Product) {
    toast.error("Duplication will be enabled in the next update.");
  }

  function deleteProduct(p: Product) {
    toast.error("Deletion will be enabled in the next update.");
    setDeleteTarget(null);
    setViewing(null);
  }

  function bulkDelete(ids: string[]) {
    toast.error("Bulk actions will be enabled in the next update.");
  }

  function confirmBulkDelete() { setBulkDeleteOpen(false); }

  function recordMovement(m: any) {
    toast.error("Stock adjustments are coming in the next update.");
    setAdjustOpen(false);
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
            Manage products, stock, and categories.{" "}
            <span className="text-xs text-success">Products are now connected to PostgreSQL!</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => openAdjust()} disabled>
            <Plus />
            Adjust stock
          </Button>
          <Button onClick={openAdd} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus />}
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
        <StockMovementTable movements={movements} onRecord={() => openAdjust()} />
      )}

      {tab === "low-stock" && (
        <LowStockTable products={products} onReorder={reorderFromLowStock} />
      )}

      {tab === "categories" && (
        <CategoryManager
          categories={categories}
          productCounts={productCounts}
          onCreate={() => toast.error("Category saving is coming soon!")}
          onDelete={() => toast.error("Category deletion is coming soon!")}
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
        description="This action is coming in the next update."
        onConfirm={() => deleteProduct(deleteTarget!)}
      />

      <DeleteDialog
        open={bulkDeleteOpen}
        onOpenChange={(o) => !o && setBulkDeleteOpen(false)}
        title={`Delete ${bulkDeleteIds.length} products?`}
        description="This action is coming in the next update."
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