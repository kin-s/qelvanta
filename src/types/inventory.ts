export type ProductStatus = "active" | "inactive" | "draft";
export type StockStatus = "in" | "low" | "out";

export type MovementType =
  | "received"
  | "sold"
  | "returned"
  | "adjustment"
  | "transfer"
  | "damaged";

export type MovementStatus = "pending" | "completed";

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  description: string;
  categoryId: string;
  brand: string;
  purchasePrice: number;
  sellingPrice: number;
  taxCategory: string;
  stockQuantity: number;
  reorderLevel: number;
  unit: string;
  warehouseId: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantityDelta: number;
  sourceLocation: string;
  destinationLocation: string;
  reference: string;
  date: string;
  user: string;
  status: MovementStatus;
  notes?: string;
}

export function stockStatusOf(p: Product): StockStatus {
  if (p.stockQuantity <= 0) return "out";
  if (p.stockQuantity <= p.reorderLevel) return "low";
  return "in";
}