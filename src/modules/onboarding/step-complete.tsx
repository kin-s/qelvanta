"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { useOnboardingData, resetOnboarding, updateOnboarding } from "./store";
import { createOrganization } from "@/actions/org";

export function StepComplete({ onFinish }: { onFinish?: () => void }) {
  const router = useRouter();
  const data = useOnboardingData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function enter() {
    setIsSubmitting(true);
    
    // Call the Server Action to save the Organization to Postgres
    const result = await createOrganization({
      businessName: data.businessName,
      baseCurrency: data.baseCurrency,
      timezone: data.timezone,
    });

    if (result.error) {
      toast.error("Setup failed", { description: result.error });
      setIsSubmitting(false);
      return;
    }

    // Mark onboarding as complete locally
    updateOnboarding({ completed: true });
    
    toast.success("Workspace created successfully!");
    
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
        is ready. Click below to create your database workspace.
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
      </div>

      <div className="mt-12 flex flex-col items-center gap-3">
        <Button size="lg" onClick={enter} disabled={isSubmitting}>
          {isSubmitting ? "Creating workspace..." : "Enter dashboard"}
          {!isSubmitting && <ArrowRight />}
        </Button>
        <Button variant="ghost" size="sm" onClick={startOver} disabled={isSubmitting}>
          <RotateCcw />
          Start over
        </Button>
      </div>
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