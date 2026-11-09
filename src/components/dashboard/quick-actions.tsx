"use client";

import Link from "next/link";
import { ShoppingCart, Package, Wallet, FileText, Users, UserCog } from "lucide-react";
import { toast } from "sonner";

const ACTIONS = [
  { label: "New sale", href: "/sales", icon: ShoppingCart },
  { label: "Add product", href: "/inventory", icon: Package },
  { label: "Add expense", href: "/finance", icon: Wallet },
  { label: "New invoice", href: "/invoices", icon: FileText },
  { label: "Add customer", href: "/customers", icon: Users },
  { label: "Add employee", href: "/employees", icon: UserCog },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {ACTIONS.map(({ label, href, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          onClick={() => toast(`${label} workflow ships in the module phase`)}
          className="flex flex-col items-center gap-1.5 rounded-md border border-border bg-surface/60 px-2 py-3 text-center transition-colors hover:border-accent/40 hover:bg-card"
        >
          <Icon className="h-4 w-4 text-accent" />
          <span className="text-[10px] font-medium text-foreground">{label}</span>
        </Link>
      ))}
    </div>
  );
}