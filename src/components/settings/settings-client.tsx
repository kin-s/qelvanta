"use client";

import { useState } from "react";
import { Building2, Globe2, Palette, ShieldCheck, Database, Users, Shield, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { BusinessSettings } from "./business-settings";
import { RegionalSettings } from "./regional-settings";
import { AppearanceSettings } from "./appearance-settings";
import { SecuritySettings } from "./security-settings";
import { DataManagement } from "./data-management";
import { UsersSettings } from "@/components/users/users-settings";
import { RolesSettings } from "@/components/roles/roles-settings";
import { SubscriptionSettings } from "@/components/billing/subscription-settings";

type Tab = "business" | "regional" | "appearance" | "users" | "roles" | "billing" | "security" | "data";

const TABS = [
  { id: "business" as const, label: "Business Details", icon: Building2 },
  { id: "regional" as const, label: "Regional & Currency", icon: Globe2 },
  { id: "appearance" as const, label: "Appearance", icon: Palette },
  { id: "users" as const, label: "Users", icon: Users },
  { id: "roles" as const, label: "Roles & Permissions", icon: Shield },
  { id: "billing" as const, label: "Subscription & Billing", icon: CreditCard },
  { id: "security" as const, label: "Security & Audit", icon: ShieldCheck },
  { id: "data" as const, label: "Data Management", icon: Database },
];

export function SettingsClient() {
  const [tab, setTab] = useState<Tab>("business");

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Manage your workspace configuration.{" "}
          <span className="text-xs">Demo data — changes persist locally.</span>
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="w-full lg:w-56 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0" aria-label="Settings navigation">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors lg:w-full text-left",
                    active
                      ? "bg-accent/15 text-foreground"
                      : "text-muted hover:bg-surface hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-4 w-4", active && "text-accent")} />
                  {t.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
            {tab === "business" && <BusinessSettings />}
            {tab === "regional" && <RegionalSettings />}
            {tab === "appearance" && <AppearanceSettings />}
            {tab === "users" && <UsersSettings />}
            {tab === "roles" && <RolesSettings />}
            {tab === "billing" && <SubscriptionSettings />}
            {tab === "security" && <SecuritySettings />}
            {tab === "data" && <DataManagement />}
          </div>
        </div>
      </div>
    </div>
  );
}