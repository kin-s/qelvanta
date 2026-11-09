"use client";

import { Check, Building2, Store, Warehouse } from "lucide-react";
import { StepShell, StepFooter } from "./step-shell";
import { updateOnboarding, useOnboardingData } from "./store";
import { structures } from "@/config/onboarding";
import { cn } from "@/lib/utils";
import type { StepProps } from "./types";

const iconMap = { single: Store, branches: Building2, warehouse: Warehouse };

export function StepStructure({ onNext, onBack }: StepProps) {
  const data = useOnboardingData();

  function choose(id: typeof structures[number]["id"]) {
    updateOnboarding({ structure: id });
  }

  function handleNext() {
    if (!data.structure) return;
    onNext();
  }

  return (
    <StepShell
      title="Business structure"
      description="This shapes how branches, warehouses, and reports are organised."
      footer={
        <StepFooter
          onBack={onBack}
          onNext={handleNext}
          disableNext={!data.structure}
        />
      }
    >
      <div className="space-y-3">
        {structures.map((s) => {
          const Icon = iconMap[s.id];
          const active = data.structure === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => choose(s.id)}
              aria-pressed={active}
              className={cn(
                "flex w-full items-start gap-4 rounded-lg border p-5 text-left transition-colors",
                active
                  ? "border-accent bg-accent/5"
                  : "border-border bg-card hover:border-accent/40"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
                  active ? "bg-accent/15 text-accent" : "bg-surface text-muted"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-sm font-semibold">{s.title}</h3>
                <p className="mt-1 text-xs text-muted">{s.description}</p>
              </div>
              {active && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[#111111]">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </StepShell>
  );
}