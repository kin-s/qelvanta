export type PlanId = "free" | "starter" | "growth" | "business" | "enterprise";
export type BillingCycle = "monthly" | "annual";
export type SubStatus = "active" | "cancelled";

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  features: string[];
  limits: {
    users: number | "unlimited";
    locations: number | "unlimited";
  };
}

export interface Subscription {
  planId: PlanId;
  status: SubStatus;
  cycle: BillingCycle;
  nextBillingDate: string;
}

export interface BillingRecord {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  planName: string;
}