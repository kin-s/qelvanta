"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import { SEED_SUPPLIERS, SEED_PURCHASE_ORDERS } from "@/data/suppliers";
import { SEED_PRODUCTS } from "@/data/inventory";
import type { Supplier, PurchaseOrder } from "@/types/suppliers";
import type { Product } from "@/types/inventory";
import { SuppliersOverview } from "./suppliers-overview";
import { SupplierTable } from "./supplier-table";
import { SupplierForm } from "./supplier-form";
import { SupplierDetailSheet } from "./supplier-detail-sheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type Tab = "overview" | "catalog";

function generateId(): string {
  return `sup_${crypto.randomUUID().slice(0, 8)}`;
}

export function SuppliersClient() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useLocalStorageState<Supplier[]>(
    "bizflow:suppliers",
    SEED_SUPPLIERS
  );
  const [purchaseOrders] = useLocalStorageState<PurchaseOrder[]>(
    "bizflow:purchase-orders",
    SEED_PURCHASE_ORDERS
  );
  const [products] = useLocalStorageState<Product[]>(
    "bizflow:products",
    SEED_PRODUCTS
  );

  const [tab, setTab] = useState<Tab>("overview");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [viewing, setViewing] = useState<Supplier | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "catalog", label: "Suppliers", count: suppliers.length },
  ];

  function openAdd() { setEditing(null); setFormOpen(true); }
  function openEdit(s: Supplier) { setEditing(s); setFormOpen(true); setViewing(null); }

  function submit(input: Supplier) {
    const supplier = input.id ? input : { ...input, id: generateId() };
    const exists = suppliers.some((x) => x.id === supplier.id);
    if (exists) {
      setSuppliers(suppliers.map((x) => (x.id === supplier.id ? supplier : x)));
      toast.success("Supplier updated");
    } else {
      setSuppliers([...suppliers, supplier]);
      toast.success("Supplier added");
    }
    setFormOpen(false);
    setEditing(null);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const hasPOs = purchaseOrders.some((po) => po.supplierId === deleteTarget.id);
    if (hasPOs) {
      toast.error("Cannot delete", {
        description: "This supplier has purchase orders. Cancel or complete them first.",
      });
      setDeleteTarget(null);
      return;
    }
    setSuppliers(suppliers.filter((s) => s.id !== deleteTarget.id));
    toast.success("Supplier deleted", { description: deleteTarget.name });
    setDeleteTarget(null);
    setViewing(null);
  }

  const viewingFresh = viewing
    ? suppliers.find((s) => s.id === viewing.id) ?? null
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Suppliers
          </h1>
          <p className="mt-1 text-sm text-muted">
            Supplier directory, contacts, and purchase history.{" "}
            <span className="text-xs">Demo data — changes persist locally.</span>
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus />
          Add supplier
        </Button>
      </div>

      <div role="tablist" className="flex gap-1 border-b border-border">
        {tabs.map((t) => (
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
            {typeof t.count === "number" && (
              <span className="ml-1.5 rounded-full bg-surface px-1.5 py-0.5 text-[10px] text-muted">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <SuppliersOverview suppliers={suppliers} purchaseOrders={purchaseOrders} />
      )}

      {tab === "catalog" && (
        <SupplierTable
          suppliers={suppliers}
          purchaseOrders={purchaseOrders}
          onView={(s) => setViewing(s)}
          onEdit={openEdit}
          onDelete={(s) => setDeleteTarget(s)}
        />
      )}

      <SupplierForm
        open={formOpen}
        onOpenChange={(o) => { setFormOpen(o); if (!o) setEditing(null); }}
        supplier={editing}
        onSubmit={submit}
      />

      <SupplierDetailSheet
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
        supplier={viewingFresh}
        products={products}
        purchaseOrders={purchaseOrders}
        onEdit={openEdit}
        onDelete={(s) => { setViewing(null); setDeleteTarget(s); }}
        onViewPO={() => {
          setViewing(null);
          router.push("/purchases");
        }}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{deleteTarget?.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the supplier. Purchase order history
              referencing this supplier will be preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}