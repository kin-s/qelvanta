import type { Expense, Income, AgingRecord } from "@/types/finance";

export const SEED_EXPENSES: Expense[] = [
  { id: "exp_001", title: "Office rent - Oct", category: "rent", description: "Monthly office lease", amount: 2500, currency: "USD", date: "2026-10-01T09:00:00Z", paymentMethod: "bank_transfer", supplier: "Property Mgmt Co", branch: "Main", status: "paid", createdAt: "2026-10-01T09:00:00Z" },
  { id: "exp_002", title: "Electricity bill", category: "utilities", description: "September usage", amount: 340.5, currency: "USD", date: "2026-10-05T14:30:00Z", paymentMethod: "card", supplier: "City Power", branch: "Main", status: "paid", createdAt: "2026-10-05T14:30:00Z" },
  { id: "exp_003", title: "Staff salaries - Oct", category: "salaries", description: "5 employees", amount: 15000, currency: "USD", date: "2026-10-28T10:00:00Z", paymentMethod: "bank_transfer", supplier: "Payroll", branch: "All", status: "paid", createdAt: "2026-10-28T10:00:00Z" },
  { id: "exp_004", title: "Google Ads campaign", category: "marketing", description: "Q4 lead gen", amount: 1200, currency: "USD", date: "2026-10-15T11:00:00Z", paymentMethod: "card", supplier: "Google", branch: "Main", status: "paid", createdAt: "2026-10-15T11:00:00Z" },
  { id: "exp_005", title: "Office supplies restock", category: "supplies", description: "Paper, pens, toner", amount: 185.2, currency: "USD", date: "2026-10-20T16:20:00Z", paymentMethod: "cash", supplier: "Staples", branch: "Main", status: "paid", createdAt: "2026-10-20T16:20:00Z" },
  { id: "exp_006", title: "Courier service", category: "transport", description: "Client deliveries", amount: 75, currency: "USD", date: "2026-11-02T09:15:00Z", paymentMethod: "cash", supplier: "DHL", branch: "Main", status: "paid", createdAt: "2026-11-02T09:15:00Z" },
  { id: "exp_007", title: "Office rent - Nov", category: "rent", description: "Monthly office lease", amount: 2500, currency: "USD", date: "2026-11-01T09:00:00Z", paymentMethod: "bank_transfer", supplier: "Property Mgmt Co", branch: "Main", status: "paid", createdAt: "2026-11-01T09:00:00Z" },
  { id: "exp_008", title: "AC maintenance", category: "maintenance", description: "Quarterly servicing", amount: 250, currency: "USD", date: "2026-11-04T13:00:00Z", paymentMethod: "card", supplier: "CoolAir", branch: "Main", status: "pending", createdAt: "2026-11-04T13:00:00Z" },
];

export const SEED_INCOME: Income[] = [
  { id: "inc_001", title: "POS daily sales batch", category: "sales", description: "Consolidated Oct 28 sales", amount: 4250, currency: "USD", date: "2026-10-28T18:00:00Z", paymentMethod: "card", source: "POS", reference: "BATCH-1028", createdAt: "2026-10-28T18:00:00Z" },
  { id: "inc_002", title: "Consulting gig - Initech", category: "consulting", description: "Q4 strategy workshop", amount: 3500, currency: "USD", date: "2026-10-30T14:00:00Z", paymentMethod: "bank_transfer", source: "Direct", reference: "INV-CONS-01", createdAt: "2026-10-30T14:00:00Z" },
  { id: "inc_003", title: "POS daily sales batch", category: "sales", description: "Consolidated Nov 02 sales", amount: 1890, currency: "USD", date: "2026-11-02T18:00:00Z", paymentMethod: "cash", source: "POS", reference: "BATCH-1102", createdAt: "2026-11-02T18:00:00Z" },
  { id: "inc_004", title: "Setup service fee", category: "services", description: "Onboarding fee - Nordic", amount: 1200, currency: "USD", date: "2026-11-03T10:30:00Z", paymentMethod: "digital_wallet", source: "Direct", reference: "INV-SRV-44", createdAt: "2026-11-03T10:30:00Z" },
  { id: "inc_005", title: "Bank interest", category: "interest", description: "Business savings", amount: 45.5, currency: "USD", date: "2026-11-05T08:00:00Z", paymentMethod: "bank_transfer", source: "Bank", reference: "INT-1105", createdAt: "2026-11-05T08:00:00Z" },
];

export const SEED_RECEIVABLES: AgingRecord[] = [
  { id: "ar_001", partyName: "Acme Ltd", reference: "INV-1045", originalAmount: 4250, paidAmount: 0, dueDate: "2026-11-15T00:00:00Z", status: "current" },
  { id: "ar_002", partyName: "Globex Inc", reference: "INV-1046", originalAmount: 1890, paidAmount: 500, dueDate: "2026-10-30T00:00:00Z", status: "overdue" },
  { id: "ar_003", partyName: "Initech", reference: "INV-1047", originalAmount: 12300, paidAmount: 12300, dueDate: "2026-10-20T00:00:00Z", status: "paid" },
];

export const SEED_PAYABLES: AgingRecord[] = [
  { id: "ap_001", partyName: "Acme Wholesale", reference: "BILL-2026-1101", originalAmount: 1210, paidAmount: 0, dueDate: "2026-11-20T00:00:00Z", status: "current" },
  { id: "ap_002", partyName: "Global Tech Supply", reference: "BILL-2026-1108", originalAmount: 4884, paidAmount: 0, dueDate: "2026-11-15T00:00:00Z", status: "current" },
  { id: "ap_003", partyName: "Nordic Furniture Co.", reference: "BILL-2026-1115", originalAmount: 3063.5, paidAmount: 0, dueDate: "2026-10-28T00:00:00Z", status: "overdue" },
];