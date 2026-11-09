"use client";

import { Check } from "lucide-react";
import { StepShell, StepFooter } from "./step-shell";
import { updateOnboarding, useOnboardingData } from "./store";
import { moduleOptions } from "@/config/onboarding";
import { cn } from "@/lib/utils";
import type { StepProps } from "./types";

export function StepModules({ onNext, onBack, onSkip }: StepProps) {
  const data = useOnboardingData();

  function toggle(id: string) {
    const has = data.modules.includes(id);
    updateOnboarding({
      modules: has ? data.modules.filter((m) => m !== id) : [...data.modules, id],
    });
  }

  return (
    <StepShell
      title="Initial setup"
      description="Pick the modules you plan to use. You can enable more later."
      footer={
        <StepFooter
          onBack={onBack}
          onNext={onNext}
          onSkip={onSkip}
        />
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {moduleOptions.map((m) => {
          const active = data.modules.includes(m.id);
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => toggle(m.id)}
              aria-pressed={active}
              className={cn(
                "flex items-center gap-3 rounded-md border p-4 text-left transition-colors",
                active
                  ? "border-accent bg-accent/5"
                  : "border-border bg-card hover:border-accent/40"
              )}
            >
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded border",
                  active ? "border-accent bg-accent text-[#111111]" : "border-border"
                )}
              >
                {active && <Check className="h-3 w-3" />}
              </div>
              <span className="text-sm font-medium">{m.label}</span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted">
        {data.modules.length} selected. All modules share the same data and permissions.
      </p>
    </StepShell>
  );
}