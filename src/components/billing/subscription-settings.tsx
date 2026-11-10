"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import { SEED_SUBSCRIPTION, SEED_BILLING_HISTORY, PLANS } from "@/data/billing";
import type { Subscription, BillingCycle } from "@/types/billing";
import { BillingHistory } from "./billing-history";
import { PlanComparison } from "./plan-comparison";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

export function SubscriptionSettings() {
  const [sub, setSub] = useLocalStorageState<Subscription>("bizflow:subscription", SEED_SUBSCRIPTION);
  const [history] = useLocalStorageState("bizflow:billing-history", SEED_BILLING_HISTORY);
  
  const [viewPlanList, setViewPlanList] = useState(false);

  const currentPlan = PLANS.find(p => p.id === sub.planId) || PLANS[0];
  const currentPrice = sub.cycle === "monthly" ? currentPlan.monthlyPrice : currentPlan.annualPrice;

  // Mock usage stats
  const usage = { users: 4, locations: 2 };

  function handleCycleChange(c: BillingCycle) {
    setSub({ ...sub, cycle: c });
    toast.success(`Switched to ${c} billing`);
  }

  function handleUpgrade(planId: string) {
    if (planId === "enterprise") {
      toast("Enterprise requires a custom quote", { description: "Contact sales to proceed." });
      return;
    }
    setSub({ ...sub, planId: planId as Subscription["planId"], status: "active" });
    setViewPlanList(false);
    toast.success("Plan updated");
  }

  function handleCancel() {
    setSub({ ...sub, status: "cancelled" });
    toast.error("Subscription cancelled", { description: "You will retain access until the end of the billing period." });
  }

  function handleResume() {
    setSub({ ...sub, status: "active" });
    toast.success("Subscription resumed");
  }

  if (viewPlanList) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <Button variant="ghost" onClick={() => setViewPlanList(false)} className="-ml-3 mb-2">
          ← Back to billing overview
        </Button>
        <PlanComparison 
          plans={PLANS} 
          currentSub={sub} 
          cycle={sub.cycle} 
          onUpgrade={handleUpgrade} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Current Plan Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-semibold">Subscription Overview</h2>
            <p className="text-sm text-muted">Manage your plan, billing cycle, and usage.</p>
          </div>
          <Badge variant={sub.status === "active" ? "success" : "danger"}>
            {sub.status}
          </Badge>
        </div>

        <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted mb-1">Current Plan</p>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-accent" />
                  <h3 className="font-heading text-xl font-bold">{currentPlan.name}</h3>
                </div>
                <p className="text-sm text-muted">{currentPlan.description}</p>
                
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-heading text-3xl font-semibold">
                    {currentPrice === null ? "Custom" : formatCurrency(currentPrice)}
                  </span>
                  {currentPrice !== null && (
                    <span className="text-sm text-muted">
                      /{sub.cycle === "monthly" ? "month" : "year"}
                    </span>
                  )}
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button onClick={() => setViewPlanList(true)}>Change Plan</Button>
                  {sub.status === "active" ? (
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  ) : (
                    <Button variant="secondary" onClick={handleResume}>Resume</Button>
                  )}
                </div>
              </div>

              <div className="space-y-4 md:border-l md:border-border md:pl-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted mb-1">Billing Cycle</p>
                  <div className="flex gap-1 rounded-md border border-border bg-surface p-1 max-w-[200px]">
                    <button onClick={() => handleCycleChange("monthly")} className={cn("flex-1 rounded-sm px-2 py-1 text-xs font-medium", sub.cycle === "monthly" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground")}>Monthly</button>
                    <button onClick={() => handleCycleChange("annual")} className={cn("flex-1 rounded-sm px-2 py-1 text-xs font-medium", sub.cycle === "annual" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground")}>Annual</button>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted mb-1">
                    {sub.status === "active" ? "Next Billing Date" : "Access Expires"}
                  </p>
                  <p className="font-medium">{formatDate(sub.nextBillingDate)}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-muted mb-1">Usage Limits</p>
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">Users</span>
                      <span className="font-medium">{usage.users} / {currentPlan.limits.users === "unlimited" ? "∞" : currentPlan.limits.users}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">Locations</span>
                      <span className="font-medium">{usage.locations} / {currentPlan.limits.locations === "unlimited" ? "∞" : currentPlan.limits.locations}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Billing History */}
      <BillingHistory records={history} />

    </div>
  );
}