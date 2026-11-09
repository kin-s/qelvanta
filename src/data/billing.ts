import type { Plan, Subscription, BillingRecord } from "@/types/billing";

export const PLANS: Plan[] = [
  {
    id: "free", name: "Free", description: "For getting started",
    monthlyPrice: 0, annualPrice: 0,
    features: ["1 user", "1 location", "Up to 50 products", "Basic inventory & sales", "Community support"],
    limits: { users: 1, locations: 1 }
  },
  {
    id: "starter", name: "Starter", description: "For small teams",
    monthlyPrice: 12, annualPrice: 120,
    features: ["3 users", "1 location", "Unlimited products", "Sales & POS", "Basic reports", "Email support"],
    limits: { users: 3, locations: 1 }
  },
  {
    id: "growth", name: "Growth", description: "For growing businesses",
    monthlyPrice: 29, annualPrice: 290,
    features: ["10 users", "3 locations", "Purchasing & suppliers", "Advanced reports", "Basic automations", "Priority support"],
    limits: { users: 10, locations: 3 }
  },
  {
    id: "business", name: "Business", description: "For established operations",
    monthlyPrice: 79, annualPrice: 790,
    features: ["Unlimited users", "Unlimited locations", "AI assistant", "Advanced automations", "Audit log", "Priority support"],
    limits: { users: "unlimited", locations: "unlimited" }
  },
  {
    id: "enterprise", name: "Enterprise", description: "For large organizations",
    monthlyPrice: null, annualPrice: null,
    features: ["Unlimited everything", "Dedicated infrastructure", "Custom SLAs", "SSO & advanced security", "Dedicated success manager"],
    limits: { users: "unlimited", locations: "unlimited" }
  },
];

export const SEED_SUBSCRIPTION: Subscription = {
  planId: "growth",
  status: "active",
  cycle: "monthly",
  nextBillingDate: "2026-12-01T00:00:00Z",
};

export const SEED_BILLING_HISTORY: BillingRecord[] = [
  { id: "INV-SUB-1004", date: "2026-11-01T00:00:00Z", amount: 29.00, status: "paid", planName: "Growth (Monthly)" },
  { id: "INV-SUB-1003", date: "2026-10-01T00:00:00Z", amount: 29.00, status: "paid", planName: "Growth (Monthly)" },
  { id: "INV-SUB-1002", date: "2026-09-01T00:00:00Z", amount: 29.00, status: "paid", planName: "Growth (Monthly)" },
  { id: "INV-SUB-1001", date: "2026-08-01T00:00:00Z", amount: 12.00, status: "paid", planName: "Starter (Monthly)" },
];