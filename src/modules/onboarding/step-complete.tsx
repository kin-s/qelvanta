"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { useOnboardingData, resetOnboarding, updateOnboarding } from "./store";

export function StepComplete({ onFinish }: { onFinish?: () => void }) {
  const router = useRouter();
  const data = useOnboardingData();

  function enter() {
    updateOnboarding({ completed: true });
    if (onFinish) onFinish();
    else router.push("/dashboard");
  }

  function startOver() {
    resetOnboarding();
    router.push("/onboarding");
  }

  return (
    <div className="mx-auto w-full max-w-2xl text-center">
      <div className="mx-auto mb-8 inline-flex">
        <Logo size="lg" />
      </div>

      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
        <CheckCircle2 className="h-8 w-8" />
      </div>

      <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        You&apos;re all set
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base text-muted">
        <strong className="text-foreground">{data.businessName || "Your business"}</strong>{" "}
        is ready. Your workspace has been prepared with the settings you chose.
      </p>

      <div className="mx-auto mt-10 grid max-w-md gap-3 text-left">
        <SummaryRow label="Business" value={data.businessName || "—"} />
        <SummaryRow label="Industry" value={data.industry || "—"} />
        <SummaryRow label="Base currency" value={data.baseCurrency} />
        <SummaryRow label="Timezone" value={data.timezone} />
        <SummaryRow
          label="Modules enabled"
          value={`${data.modules.length} of 7`}
        />
        <SummaryRow
          label="Team invited"
          value={data.invites.length === 0 ? "None yet" : `${data.invites.length} member${data.invites.length === 1 ? "" : "s"}`}
        />
      </div>

      <div className="mt-12 flex flex-col items-center gap-3">
        <Button size="lg" onClick={enter}>
          Enter dashboard
          <ArrowRight />
        </Button>
        <Button variant="ghost" size="sm" onClick={startOver}>
          <RotateCcw />
          Start over
        </Button>
      </div>

      <p className="mt-10 text-xs text-muted">
        Dashboard is a Phase 4 stub for now. Real modules ship next.
      </p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-2.5 text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}