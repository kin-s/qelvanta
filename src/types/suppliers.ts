export type SupplierStatus = "active" | "inactive";

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  city: string;
  taxId: string;
  paymentTerms: string;
  status: SupplierStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type PurchaseOrderStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "ordered"
  | "partially_received"
  | "received"
  | "cancelled";

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  receivedQty: number;
  unitCost: number;
  lineTotal: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  createdAt: string;
  expectedDelivery: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  notes: string;
  createdBy: string;
  receivedAt?: string;
}

export const PO_STATUS_LABELS: Record<PurchaseOrderStatus, string> = {
  draft: "Draft",
  pending_approval: "Pending approval",
  approved: "Approved",
  ordered: "Ordered",
  partially_received: "Partially received",
  received: "Received",
  cancelled: "Cancelled",
};

export const PO_STATUS_VARIANTS: Record<
  PurchaseOrderStatus,
  "success" | "warning" | "danger" | "info" | "muted" | "default" | "accent"
> = {
  draft: "muted",
  pending_approval: "warning",
  approved: "info",
  ordered: "accent",
  partially_received: "warning",
  received: "success",
  cancelled: "danger",
};

export function remainingQty(item: PurchaseOrderItem): number {
  return Math.max(0, item.quantity - item.receivedQty);
}

export function isFullyReceived(po: PurchaseOrder): boolean {
  return po.items.every((i) => i.receivedQty >= i.quantity);
}

export function poProgressPct(po: PurchaseOrder): number {
  const totalQty = po.items.reduce((s, i) => s + i.quantity, 0);
  const receivedQty = po.items.reduce((s, i) => s + i.receivedQty, 0);
  if (totalQty === 0) return 0;
  return Math.round((receivedQty / totalQty) * 100);
}