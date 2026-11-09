import type { User, Role } from "@/types/users";

const ALL_PERMISSIONS = [
  "dashboard:read", "reports:read", 
  "sales:read", "sales:write", "invoices:read", "invoices:write",
  "inventory:read", "inventory:write", "suppliers:read", "purchases:read", "purchases:write",
  "finance:read", "finance:write",
  "customers:read", "customers:write", "employees:read", "employees:write", "branches:read",
  "settings:read", "settings:manage", "users:manage"
];

export const SEED_ROLES: Role[] = [
  {
    id: "role_owner", name: "Business Owner", description: "Full access to all modules and settings.", isSystem: true,
    permissions: ALL_PERMISSIONS
  },
  {
    id: "role_admin", name: "Administrator", description: "Full operational access, except billing.", isSystem: true,
    permissions: ALL_PERMISSIONS.filter(p => p !== "users:manage")
  },
  {
    id: "role_manager", name: "Manager", description: "Manages daily operations, staff, and sales.", isSystem: false,
    permissions: [
      "dashboard:read", "reports:read", "sales:read", "sales:write", "invoices:read", "invoices:write",
      "inventory:read", "inventory:write", "suppliers:read", "purchases:read", "purchases:write",
      "customers:read", "customers:write", "employees:read", "employees:write", "branches:read", "finance:read"
    ]
  },
  {
    id: "role_cashier", name: "Cashier", description: "Point of sale and basic customer access.", isSystem: false,
    permissions: [
      "dashboard:read", "sales:read", "sales:write", "inventory:read", "customers:read"
    ]
  }
];

export const SEED_USERS: User[] = [
  { id: "usr_1", name: "Amina Kimani", email: "amina@bizflow.example", roleId: "role_owner", status: "active", createdAt: "2026-01-15T00:00:00Z" },
  { id: "usr_2", name: "Bob Smith", email: "bob@bizflow.example", roleId: "role_cashier", status: "active", createdAt: "2026-03-10T00:00:00Z" },
  { id: "usr_3", name: "Sara Chen", email: "sara@bizflow.example", roleId: "role_admin", status: "active", createdAt: "2026-06-05T00:00:00Z" },
  { id: "usr_4", name: "Priya Patel", email: "priya@bizflow.example", roleId: "role_manager", status: "invited", createdAt: "2026-11-01T00:00:00Z" },
];