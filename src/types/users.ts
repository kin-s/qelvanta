export type UserStatus = "active" | "invited" | "suspended";

export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  status: UserStatus;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
}

export interface PermissionGroup {
  label: string;
  permissions: { id: string; label: string }[];
}

export const PERMISSION_MATRIX: PermissionGroup[] = [
  {
    label: "Dashboard & Reports",
    permissions: [
      { id: "dashboard:read", label: "View dashboard" },
      { id: "reports:read", label: "View reports" },
    ]
  },
  {
    label: "Sales & Invoices",
    permissions: [
      { id: "sales:read", label: "View sales" },
      { id: "sales:write", label: "Create sales" },
      { id: "invoices:read", label: "View invoices" },
      { id: "invoices:write", label: "Create/edit invoices" },
    ]
  },
  {
    label: "Inventory & Purchases",
    permissions: [
      { id: "inventory:read", label: "View inventory" },
      { id: "inventory:write", label: "Edit inventory" },
      { id: "suppliers:read", label: "View suppliers" },
      { id: "purchases:read", label: "View purchases" },
      { id: "purchases:write", label: "Create purchase orders" },
    ]
  },
  {
    label: "Finance",
    permissions: [
      { id: "finance:read", label: "View finances" },
      { id: "finance:write", label: "Record income/expenses" },
    ]
  },
  {
    label: "People & Operations",
    permissions: [
      { id: "customers:read", label: "View customers" },
      { id: "customers:write", label: "Edit customers" },
      { id: "employees:read", label: "View employees" },
      { id: "employees:write", label: "Edit employees" },
      { id: "branches:read", label: "View branches" },
    ]
  },
  {
    label: "System & Admin",
    permissions: [
      { id: "settings:read", label: "View settings" },
      { id: "settings:manage", label: "Manage settings" },
      { id: "users:manage", label: "Manage users & roles" },
    ]
  }
];