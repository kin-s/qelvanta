import {
  LayoutDashboard, ShoppingCart, Package, Users, Truck, ShoppingBag,
  Wallet, FileText, UserCog, Building2, Warehouse, BarChart3,
  Sparkles, Zap, Bell, Settings,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard:read" },
    ],
  },
  {
    label: "Commerce",
    items: [
      { label: "Sales & POS", href: "/sales", icon: ShoppingCart, permission: "sales:read" },
      { label: "Invoices", href: "/invoices", icon: FileText, permission: "invoices:read" },
      { label: "Customers", href: "/customers", icon: Users, permission: "customers:read" },
    ],
  },
  {
    label: "Inventory",
    items: [
      { label: "Inventory", href: "/inventory", icon: Package, permission: "inventory:read" },
      { label: "Suppliers", href: "/suppliers", icon: Truck, permission: "suppliers:read" },
      { label: "Purchases", href: "/purchases", icon: ShoppingBag, permission: "purchases:read" },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Finance", href: "/finance", icon: Wallet, permission: "finance:read" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Employees", href: "/employees", icon: UserCog, permission: "employees:read" },
      { label: "Branches", href: "/branches", icon: Building2, permission: "branches:read" },
      { label: "Warehouses", href: "/warehouses", icon: Warehouse, permission: "warehouses:read" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Reports", href: "/reports", icon: BarChart3, permission: "reports:read" },
      { label: "AI Assistant", href: "/ai-assistant", icon: Sparkles, permission: "ai:read" },
      { label: "Automations", href: "/automations", icon: Zap, permission: "automations:read" },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Notifications", href: "/notifications", icon: Bell, permission: "notifications:read" },
      { label: "Settings", href: "/settings", icon: Settings, permission: "settings:read" },
    ],
  },
];

export const flatNavItems: NavItem[] = navSections.flatMap((s) => s.items);

// Demo: owner role has all permissions. Real permission check happens in Phase 12.
export function hasPermission(_permission: string): boolean {
  void _permission;
  return true;
}

export const mobilePrimaryItems = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Sales", href: "/sales", icon: ShoppingCart },
  { label: "Inventory", href: "/inventory", icon: Package },
  { label: "Customers", href: "/customers", icon: Users },
] as const;