"use client";

import { Banknote, CreditCard, Building, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/types/sales";

const OPTIONS: { value: PaymentMethod; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "card", label: "Card", icon: CreditCard },
  { value: "bank_transfer", label: "Bank transfer", icon: Building },
  { value: "digital_wallet", label: "Digital wallet", icon: Wallet },
];

export function PaymentMethodPicker({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (v: PaymentMethod) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Payment method" className="grid grid-cols-2 gap-2">
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex flex-col items-start gap-1 rounded-md border p-3 text-left transition-colors",
              active
                ? "border-accent bg-accent/10"
                : "border-border bg-surface hover:border-accent/40 hover:bg-card"
            )}
          >
            <Icon className={cn("h-4 w-4", active ? "text-accent" : "text-muted")} />
            <span className={cn("text-xs font-medium", active ? "text-foreground" : "text-muted")}>
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}