"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Section, SectionHeader } from "./section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { plans } from "@/config/marketing";
import { cn } from "@/lib/utils";

type Cycle = "monthly" | "annual";

export function PricingPreview() {
  const [cycle, setCycle] = useState<Cycle>("monthly");

  return (
    <Section id="pricing">
      <SectionHeader
        overline="Pricing"
        title="Simple plans that grow with you"
        description="Start free. Upgrade when you're ready. All plans include unlimited products, secure data, and access to the platform from any device."
      />

      <div className="mb-10 flex justify-center">
        <div
          role="radiogroup"
          aria-label="Billing cycle"
          className="inline-flex rounded-md border border-border bg-card p-1"
        >
          {(["monthly", "annual"] as const).map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={cycle === c}
              onClick={() => setCycle(c)}
              className={cn(
                "rounded-sm px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                cycle === c
                  ? "bg-accent text-[#111111]"
                  : "text-muted hover:text-foreground"
              )}
            >
              {c}
              {c === "annual" && (
                <span className="ml-1.5 text-[10px] font-semibold">−17%</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {plans.map((plan) => {
          const price =
            cycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
          const period = cycle === "monthly" ? "/month" : "/year";
          const custom = price === null;

          return (
            <Card
              key={plan.id}
              className={cn(
                "relative flex flex-col",
                plan.highlight
                  ? "border-accent/60 bg-gradient-to-b from-accent/5 to-transparent shadow-lg"
                  : ""
              )}
            >
              {plan.highlight && (
                <Badge
                  variant="accent"
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2"
                >
                  Most popular
                </Badge>
              )}
              <CardContent className="flex flex-1 flex-col p-6 pt-7">
                <h3 className="font-heading text-lg font-semibold">{plan.name}</h3>
                <p className="mt-1 text-xs text-muted">{plan.description}</p>

                <div className="mt-5">
                  {custom ? (
                    <div className="font-heading text-3xl font-semibold">Custom</div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="tabular font-heading text-3xl font-semibold">
                        ${price}
                      </span>
                      <span className="text-xs text-muted">{period}</span>
                    </div>
                  )}
                </div>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-muted">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant={plan.highlight ? "default" : "secondary"}
                  className="mt-6 w-full"
                  size="sm"
                >
                  <Link href={custom ? "/contact" : "/register"}>
                    {plan.cta}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-muted">
        Prices in USD. All plans billed in the currency of your organization. Plans are
        demonstration-only during frontend development — real billing arrives with the backend.
      </p>
    </Section>
  );
}