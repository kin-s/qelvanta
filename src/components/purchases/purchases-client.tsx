"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import { SEED_PURCHASE_ORDERS, SEED_SUPPLIERS } from "@/data/suppliers";
import { SEED_PRODUCTS, SEED_MOVEMENTS } from "@/data/inventory";
import type {
  PurchaseOrder, Supplier, PurchaseOrderStatus,
} from "@/types/suppliers";
import type { Product, StockMovement } from "@/types/inventory";
import { PurchaseOrderForm } from "./purchase-order-form";
import { PurchaseOrderTable } from "./purchase-order-table";
import { PurchaseOrderDetailSheet } from "./purchase-order-detail-sheet";
import { GoodsReceivedDialog } from "./goods-received-dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function generateMovementId(): string {
  return `mov_${crypto.randomUUID().slice(0, 8)}`;
}

export function PurchasesClient() {
  const [purchaseOrders, setPurchaseOrders] = useLocalStorageState<PurchaseOrder[]>(
    "bizflow:purchase-orders",
    SEED_PURCHASE_ORDERS
  );
  const [suppliers] = useLocalStorageState<Supplier[]>(
    "bizflow:suppliers",
    SEED_SUPPLIERS
  );
  const [products, setProducts] = useLocalStorageState<Product[]>(
    "bizflow:products",
    SEED_PRODUCTS
  );
  const [movements, setMovements] = useLocalStorageState<StockMovement[]>(
    "bizflow:stock-movements",
    SEED_MOVEMENTS
  );

  const [formOpen, setFormOpen] = useState(false);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [receivingId, setReceivingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PurchaseOrder | null>(null);

  const viewingPO = viewingId ? purchaseOrders.find((p) => p.id === viewingId) ?? null : null;
  const receivingPO = receivingId ? purchaseOrders.find((p) => p.id === receivingId) ?? null : null;

  function submitNewPO(po: PurchaseOrder) {
    setPurchaseOrders([po, ...purchaseOrders]);
    toast.success("Purchase order created", { description: po.id });
    setViewingId(po.id);
  }

  function changeStatus(po: PurchaseOrder, next: PurchaseOrderStatus) {
    const now = new Date().toISOString();
    setPurchaseOrders(
      purchaseOrders.map((p) => {
        if (p.id !== po.id) return p;
        const updated: PurchaseOrder = { ...p, status: next };
        if (next === "received") updated.receivedAt = now;
        return updated;
      })
    );
    toast.success(`PO ${po.id} → ${next.replace("_", " ")}`);
  }

  function receiveGoods(receivedMap: Record<string, number>) {
    if (!receivingPO) return;
    const now = new Date().toISOString();

    // 1. Update PO items + status
    const updatedPOs = purchaseOrders.map((po) => {
      if (po.id !== receivingPO.id) return po;
      const newItems = po.items.map((item) => {
        const qty = receivedMap[item.productId] ?? 0;
        return { ...item, receivedQty: Math.min(item.quantity, item.receivedQty + qty) };
      });
      const fully = newItems.every((i) => i.receivedQty >= i.quantity);
      return {
        ...po,
        items: newItems,
        status: (fully ? "received" : "partially_received") as PurchaseOrderStatus,
        receivedAt: fully ? now : po.receivedAt,
      };
    });
    setPurchaseOrders(updatedPOs);

    // 2. Increment product stock
    const updatedProducts = products.map((p) => {
      const qty = receivedMap[p.id];
      if (!qty) return p;
      return {
        ...p,
        stockQuantity: p.stockQuantity + qty,
        updatedAt: now,
      };
    });
    setProducts(updatedProducts);

    // 3. Create stock movements
    const newMovements: StockMovement[] = Object.entries(receivedMap).map(
      ([productId, qty]) => {
        const product = products.find((p) => p.id === productId);
        return {
          id: generateMovementId(),
          productId,
          productName: product?.name ?? "Unknown",
          type: "received",
          quantityDelta: qty,
          sourceLocation: receivingPO.supplierName,
          destinationLocation: product?.warehouseId === "wh_main" ? "Main warehouse" : "Store front",
          reference: receivingPO.id,
          date: now,
          user: "Demo User",
          status: "completed",
          notes: `Received against ${receivingPO.id}`,
        };
      }
    );
    setMovements([...newMovements, ...movements]);

    setReceivingId(null);
    toast.success("Goods received", {
      description: `${newMovements.length} line${newMovements.length === 1 ? "" : "s"} · ${newMovements.reduce((s, m) => s + m.quantityDelta, 0)} units`,
    });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setPurchaseOrders(purchaseOrders.filter((p) => p.id !== deleteTarget.id));
    toast.success("Purchase order deleted", { description: deleteTarget.id });
    setDeleteTarget(null);
    setViewingId(null);
  }

  const totalOpen = purchaseOrders.filter(
    (p) => p.status !== "received" && p.status !== "cancelled" && p.status !== "draft"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Purchases
          </h1>
          <p className="mt-1 text-sm text-muted">
            Purchase orders, goods received, and full inventory sync.{" "}
            <span className="text-xs">Demo — receipts update stock live.</span>
          </p>
          <p className="mt-2 text-xs text-muted">
            <strong className="text-foreground">{totalOpen}</strong> open purchase orders
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus />
          New purchase order
        </Button>
      </div>

      <PurchaseOrderTable
        purchaseOrders={purchaseOrders}
        onView={(po) => setViewingId(po.id)}
        onDelete={(po) => setDeleteTarget(po)}
      />

      <PurchaseOrderForm
        open={formOpen}
        onOpenChange={setFormOpen}
        suppliers={suppliers}
        products={products}
        onSubmit={submitNewPO}
      />

      <PurchaseOrderDetailSheet
        open={!!viewingId}
        onOpenChange={(o) => !o && setViewingId(null)}
        po={viewingPO}
        onChangeStatus={changeStatus}
        onReceive={(po) => setReceivingId(po.id)}
        onDelete={(po) => setDeleteTarget(po)}
      />

      <GoodsReceivedDialog
        open={!!receivingId}
        onOpenChange={(o) => !o && setReceivingId(null)}
        po={receivingPO}
        onSubmit={receiveGoods}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.id}?</AlertDialogTitle>
            <AlertDialogDescription>
              This purchase order will be permanently removed. Only draft or
              cancelled POs can be deleted.
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