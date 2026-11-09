import {
  ShoppingCart, Wallet, Users, Package, FileText, UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActivityItem, ActivityType } from "@/types/dashboard";

const ICONS: Record<ActivityType, React.ComponentType<{ className?: string }>> = {
  sale: ShoppingCart,
  expense: Wallet,
  customer: Users,
  stock: Package,
  invoice: FileText,
  employee: UserCog,
};

const COLORS: Record<ActivityType, string> = {
  sale: "bg-success/15 text-success",
  expense: "bg-danger/15 text-danger",
  customer: "bg-info/15 text-info",
  stock: "bg-accent/15 text-accent",
  invoice: "bg-warning/15 text-warning",
  employee: "bg-muted/15 text-muted",
};

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted">No recent activity.</p>
    );
  }
  return (
    <ul className="-mx-2 space-y-1">
      {items.map((item) => {
        const Icon = ICONS[item.type];
        return (
          <li
            key={item.id}
            className="flex items-start gap-3 rounded-md px-2 py-2 hover:bg-surface/60"
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                COLORS[item.type]
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.title}
                </p>
                {typeof item.amount === "number" && (
                  <span className="tabular shrink-0 text-sm font-medium text-foreground">
                    {formatAmount(item.amount)}
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-muted">{item.description}</p>
              <p className="mt-0.5 text-[10px] text-muted/80">{item.time}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}