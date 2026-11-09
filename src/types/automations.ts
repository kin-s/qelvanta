export type AutomationStatus = "active" | "paused";
export type AutomationTrigger =
  | "stock_low"
  | "invoice_overdue"
  | "daily_summary"
  | "expense_large"
  | "shift_reminder"
  | "monthly_report";

export interface Automation {
  id: string;
  name: string;
  trigger: AutomationTrigger;
  status: AutomationStatus;
  lastRun: string | null;
  createdAt: string;
}

export type NotificationType = "sales" | "inventory" | "finance" | "system";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

export const TRIGGER_LABELS: Record<AutomationTrigger, string> = {
  stock_low: "When stock falls below reorder level",
  invoice_overdue: "When an invoice becomes overdue",
  daily_summary: "Daily sales summary (end of day)",
  expense_large: "When an unusually large expense is recorded",
  shift_reminder: "Upcoming employee shift reminder",
  monthly_report: "Monthly performance report generation",
};

export const NOTIFICATION_LABELS: Record<NotificationType, string> = {
  sales: "Sales",
  inventory: "Inventory",
  finance: "Finance",
  system: "System",
};