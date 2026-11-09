export type InvoiceStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "partial"
  | "paid"
  | "overdue"
  | "cancelled";

export type QuotationStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "declined"
  | "expired";

export type DocumentType = "invoice" | "quotation";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  type: "invoice";
  customerId: string;
  customerName: string;
  customerEmail: string;
  issueDate: string;
  dueDate: string;
  items: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountPct: number;
  discountAmount: number;
  total: number;
  status: InvoiceStatus;
  notes: string;
  createdAt: string;
}

export interface Quotation {
  id: string;
  type: "quotation";
  customerId: string;
  customerName: string;
  customerEmail: string;
  issueDate: string;
  expiryDate: string;
  items: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountPct: number;
  discountAmount: number;
  total: number;
  status: QuotationStatus;
  notes: string;
  createdAt: string;
}

export type BusinessDocument = Invoice | Quotation;

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  viewed: "Viewed",
  partial: "Partially paid",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

export const QUOTATION_STATUS_LABELS: Record<QuotationStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  declined: "Declined",
  expired: "Expired",
};

export const STATUS_VARIANTS: Record<string, "success" | "warning" | "danger" | "info" | "muted" | "default" | "accent"> = {
  draft: "muted",
  sent: "info",
  viewed: "info",
  partial: "warning",
  paid: "success",
  overdue: "danger",
  cancelled: "danger",
  accepted: "success",
  declined: "danger",
  expired: "muted",
};