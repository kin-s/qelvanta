export type ExpenseCategory =
  | "rent"
  | "utilities"
  | "salaries"
  | "transport"
  | "marketing"
  | "supplies"
  | "maintenance"
  | "insurance"
  | "taxes"
  | "other";

export type IncomeCategory =
  | "sales"
  | "services"
  | "consulting"
  | "interest"
  | "other";

export type PaymentMethod = "cash" | "card" | "bank_transfer" | "digital_wallet";

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  currency: string;
  date: string;
  paymentMethod: PaymentMethod;
  supplier: string;
  branch: string;
  status: "paid" | "pending";
  createdAt: string;
}

export interface Income {
  id: string;
  title: string;
  category: IncomeCategory;
  description: string;
  amount: number;
  currency: string;
  date: string;
  paymentMethod: PaymentMethod;
  source: string;
  reference: string;
  createdAt: string;
}

export interface AgingRecord {
  id: string;
  partyName: string;
  reference: string;
  originalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: "current" | "overdue" | "paid";
}

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  rent: "Rent",
  utilities: "Utilities",
  salaries: "Salaries",
  transport: "Transport",
  marketing: "Marketing",
  supplies: "Supplies",
  maintenance: "Maintenance",
  insurance: "Insurance",
  taxes: "Taxes",
  other: "Other",
};

export const INCOME_CATEGORY_LABELS: Record<IncomeCategory, string> = {
  sales: "Sales",
  services: "Services",
  consulting: "Consulting",
  interest: "Interest",
  other: "Other",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  card: "Card",
  bank_transfer: "Bank transfer",
  digital_wallet: "Digital wallet",
};