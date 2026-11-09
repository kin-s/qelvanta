"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Section, SectionHeader } from "@/components/marketing/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { plans, faqs } from "@/config/marketing";
import { cn } from "@/lib/utils";

type Cycle = "monthly" | "annual";

const comparison: {
  category: string;
  rows: { label: string; free: string | boolean; starter: string | boolean; growth: string | boolean; business: string | boolean; enterprise: string | boolean }[];
}[] = [
  {
    category: "Usage",
    rows: [
      { label: "Users", free: "1", starter: "3", growth: "10", business: "Unlimited", enterprise: "Unlimited" },
      { label: "Locations", free: "1", starter: "1", growth: "3", business: "Unlimited", enterprise: "Unlimited" },
      { label: "Products", free: "50", starter: "Unlimited", growth: "Unlimited", business: "Unlimited", enterprise: "Unlimited" },
    ],
  },
  {
    category: "Features",
    rows: [
      { label: "Inventory", free: true, starter: true, growth: true, business: true, enterprise: true },
      { label: "Sales & POS", free: true, starter: true, growth: true, business: true, enterprise: true },
      { label: "Finance", free: false, starter: true, growth: true, business: true, enterprise: true },
      { label: "CRM", free: false, starter: true, growth: true, business: true, enterprise: true },
      { label: "Purchasing & suppliers", free: false, starter: false, growth: true, business: true, enterprise: true },
      { label: "Multi-branch", free: false, starter: false, growth: true, business: true, enterprise: true },
      { label: "Advanced reports", free: false, starter: false, growth: true, business: true, enterprise: true },
      { label: "Automations", free: false, starter: false, growth: "Basic", business: "Advanced", enterprise: "Advanced" },
      { label: "AI assistant", free: false, starter: false, growth: false, business: true, enterprise: true },
      { label: "Audit log", free: false, starter: false, growth: false, business: true, enterprise: true },
      { label: "SSO & custom SLAs", free: false, starter: false, growth: false, business: false, enterprise: true },
    ],
  },
  {
    category: "Support",
    rows: [
      { label: "Community support", free: true, starter: true, growth: true, business: true, enterprise: true },
      { label: "Email support", free: false, starter: true, growth: true, business: true, enterprise: true },
      { label: "Priority support", free: false, starter: false, growth: true, business: true, enterprise: true },
      { label: "Dedicated success manager", free: false, starter: false, growth: false, business: false, enterprise: true },
    ],
  },
];

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="mx-auto h-4 w-4 text-success" aria-label="Included" />
    ) : (
      <X className="mx-auto h-4 w-4 text-muted/50" aria-label="Not included" />
    );
  }
  return <span className="text-xs text-muted">{value}</span>;
}

export default function PricingPage() {
  const [cycle, setCycle] = useState<Cycle>("monthly");

  return (
    <>
      <PageHero
        overline="Pricing"
        title="Simple plans. No surprise fees."
        description="Start free, upgrade when you outgrow it. All plans include secure data, unlimited access from any device, and the same core platform."
      >
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
                cycle === c ? "bg-accent text-[#111111]" : "text-muted hover:text-foreground"
              )}
            >
              {c}
              {c === "annual" && <span className="ml-1.5 text-[10px] font-semibold">−17%</span>}
            </button>
          ))}
        </div>
      </PageHero>

      <Section className="!pt-12">
        <div className="grid gap-4 lg:grid-cols-5">
          {plans.map((plan) => {
            const price = cycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
            const period = cycle === "monthly" ? "/month" : "/year";
            const custom = price === null;
            return (
              <Card
                key={plan.id}
                className={cn(
                  "relative flex flex-col",
                  plan.highlight ? "border-accent/60 bg-gradient-to-b from-accent/5 to-transparent shadow-lg" : ""
                )}
              >
                {plan.highlight && (
                  <Badge variant="accent" className="absolute -top-2.5 left-1/2 -translate-x-1/2">
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
                        <span className="tabular font-heading text-3xl font-semibold">${price}</span>
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
                    <Link href={custom ? "/contact" : "/register"}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <p className="mt-8 text-center text-xs text-muted">
          Prices in USD. Billing is demonstration-only during frontend development — real payment processing arrives with the backend.
        </p>
      </Section>

      <Section className="bg-surface/40">
        <SectionHeader
          overline="Compare"
          title="Every feature, side by side"
          description="See exactly what's included in each plan."
        />
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-b border-border bg-surface/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted">Feature</th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted">Free</th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted">Starter</th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-accent">Growth</th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted">Business</th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((group) => (
                  <>
                    <tr key={group.category} className="bg-surface/30">
                      <td colSpan={6} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-foreground">
                        {group.category}
                      </td>
                    </tr>
                    {group.rows.map((row) => (
                      <tr key={row.label} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 text-sm text-foreground">{row.label}</td>
                        <td className="px-4 py-3 text-center"><Cell value={row.free} /></td>
                        <td className="px-4 py-3 text-center"><Cell value={row.starter} /></td>
                        <td className="px-4 py-3 text-center bg-accent/5"><Cell value={row.growth} /></td>
                        <td className="px-4 py-3 text-center"><Cell value={row.business} /></td>
                        <td className="px-4 py-3 text-center"><Cell value={row.enterprise} /></td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Section>

      <Section>
        <SectionHeader overline="FAQ" title="Pricing questions, answered" />
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible>
            {faqs.slice(0, 6).map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-sm sm:text-base">{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      <Section className="!py-16">
        <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-accent/5 to-transparent p-10 text-center">
          <h2 className="font-heading text-2xl font-semibold">Not sure which plan fits?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            Start free. Upgrade only when you hit a limit — no card needed.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/register">Start for free <ArrowRight /></Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">Talk to sales</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}