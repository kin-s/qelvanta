export type PaymentMethod = "cash" | "card" | "bank_transfer" | "digital_wallet";

export type SaleStatus = "completed" | "refunded" | "partially_refunded";

export type RefundMethod = "original" | "cash" | "store_credit";

export type RefundReason =
  | "defective"
  | "wrong_item"
  | "not_as_described"
  | "no_longer_needed"
  | "other";

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  type: "individual" | "business";
}

export interface CartItem {
  productId: string;
  name: string;
  sku: string;
  unitPrice: number;
  quantity: number;
}

export interface SaleItem {
  productId: string;
  name: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface RefundItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineRefund: number;
}

export interface Refund {
  id: string;
  createdAt: string;
  items: RefundItem[];
  amount: number;
  reason: RefundReason;
  reasonNote?: string;
  method: RefundMethod;
  cashier: string;
}

export interface Sale {
  id: string;
  createdAt: string;
  customerId?: string;
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  discountPct: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  cashier: string;
  status: SaleStatus;
  refunds?: Refund[];
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  card: "Card",
  bank_transfer: "Bank transfer",
  digital_wallet: "Digital wallet",
};

export const REFUND_REASON_LABELS: Record<RefundReason, string> = {
  defective: "Defective product",
  wrong_item: "Wrong item shipped",
  not_as_described: "Not as described",
  no_longer_needed: "No longer needed",
  other: "Other",
};

export const REFUND_METHOD_LABELS: Record<RefundMethod, string> = {
  original: "Original payment method",
  cash: "Cash refund",
  store_credit: "Store credit",
};

// Helpers

export function totalRefunded(sale: Sale): number {
  return (sale.refunds ?? []).reduce((sum, r) => sum + r.amount, 0);
}

export function refundedQtyForProduct(sale: Sale, productId: string): number {
  return (sale.refunds ?? []).reduce((sum, r) => {
    const item = r.items.find((i) => i.productId === productId);
    return sum + (item?.quantity ?? 0);
  }, 0);
}