import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Plan, Subscription, BillingCycle } from "@/types/billing";

export function PlanComparison({
  plans, currentSub, cycle, onUpgrade
}: {
  plans: Plan[]; currentSub: Subscription; cycle: BillingCycle; onUpgrade: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading text-lg font-semibold">Available Plans</h3>
        <p className="text-sm text-muted">Upgrade or downgrade your subscription. Changes are simulated.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {plans.map(plan => {
          const isCurrent = currentSub.planId === plan.id;
          const isPopular = plan.id === "growth";
          const price = cycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
          const period = cycle === "monthly" ? "/mo" : "/yr";

          return (
            <Card key={plan.id} className={cn(
              "relative flex flex-col",
              isCurrent ? "border-accent bg-accent/5 shadow-md" : isPopular ? "border-accent/40" : ""
            )}>
              {isPopular && !isCurrent && (
                <Badge variant="accent" className="absolute -top-2.5 left-1/2 -translate-x-1/2">Popular</Badge>
              )}
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-heading text-base font-semibold">{plan.name}</h4>
                  {isCurrent && <Badge variant="success" className="text-[10px]">Current</Badge>}
                </div>
                
                <div className="mb-4">
                  {price === null ? (
                    <div className="font-heading text-2xl font-semibold">Custom</div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="tabular font-heading text-2xl font-semibold">${price}</span>
                      <span className="text-xs text-muted">{period}</span>
                    </div>
                  )}
                </div>

                <ul className="flex-1 space-y-2 mb-6">
                  {plan.features.slice(0, 4).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={isCurrent ? "secondary" : isPopular ? "default" : "outline"}
                  className="w-full"
                  size="sm"
                  disabled={isCurrent}
                  onClick={() => onUpgrade(plan.id)}
                >
                  {isCurrent ? "Current Plan" : plan.id === "enterprise" ? "Contact Sales" : "Select Plan"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}