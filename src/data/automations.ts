import type { Automation, Notification } from "@/types/automations";

export const SEED_AUTOMATIONS: Automation[] = [
  { id: "auto_1", name: "Low Stock Alert", trigger: "stock_low", status: "active", lastRun: "2026-11-06T08:00:00Z", createdAt: "2026-06-01T00:00:00Z" },
  { id: "auto_2", name: "Overdue Invoice Reminder", trigger: "invoice_overdue", status: "active", lastRun: "2026-11-05T18:00:00Z", createdAt: "2026-06-15T00:00:00Z" },
  { id: "auto_3", name: "Daily Closing Report", trigger: "daily_summary", status: "active", lastRun: "2026-11-05T23:59:00Z", createdAt: "2026-07-10T00:00:00Z" },
  { id: "auto_4", name: "Large Expense Warning", trigger: "expense_large", status: "paused", lastRun: null, createdAt: "2026-09-20T00:00:00Z" },
];

export const SEED_NOTIFICATIONS: Notification[] = [
  { id: "notif_1", title: "Low stock alert", message: "Wireless charger is down to 3 units.", type: "inventory", read: false, createdAt: "2026-11-06T09:12:00Z" },
  { id: "notif_2", title: "Invoice overdue", message: "INV-1043 for Globex Inc is 6 days overdue.", type: "finance", read: false, createdAt: "2026-11-06T08:00:00Z" },
  { id: "notif_3", title: "Sale completed", message: "New sale: INV-8857 ($958.17) at Store Front.", type: "sales", read: true, createdAt: "2026-11-05T14:30:00Z" },
  { id: "notif_4", title: "System update", message: "BIZFLOW v1.2 is now available. Check the help center.", type: "system", read: true, createdAt: "2026-11-04T10:00:00Z" },
  { id: "notif_5", title: "Expense recorded", message: "Office rent recorded for $2,500.", type: "finance", read: true, createdAt: "2026-11-01T09:15:00Z" },
];