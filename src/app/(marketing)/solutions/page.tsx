import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { industries } from "@/config/marketing";

export const metadata: Metadata = {
  title: "Solutions — BIZFLOW",
  description:
    "BIZFLOW adapts to retail, wholesale, restaurants, electronics, distribution, service businesses, and small enterprises.",
};

const deepDives: Record<string, string[]> = {
  Retail: [
    "Fast POS with barcode scanning and keyboard shortcuts",
    "Real-time stock updates on every sale",
    "Customer loyalty and repeat purchase tracking",
    "Daily takings reports at close",
  ],
  Wholesale: [
    "Bulk pricing tiers and credit terms per customer",
    "Multi-warehouse stock and inter-branch transfers",
    "Purchase order management with partial receipts",
    "Aging reports on customer and supplier balances",
  ],
  Restaurants: [
    "Menu items grouped by category (mains, drinks, sides)",
    "Quick-add buttons for repeat orders",
    "Daily takings, payment-method split, and tips",
    "Stock tracking for ingredients or prepped items",
  ],
  Electronics: [
    "Serial number tracking for warranty and returns",
    "Supplier and repair history per unit",
    "Low-stock alerts across high-turnover SKUs",
    "Margin analysis by product and category",
  ],
  Distribution: [
    "Multi-warehouse stock with location transfers",
    "Purchase orders with expected delivery tracking",
    "Consolidated reporting across branches",
    "Supplier payment tracking with due-date alerts",
  ],
  "Service businesses": [
    "Quotations and invoices with recurring billing settings",
    "Client project history and outstanding balances",
    "Expense categorization for cost-of-service analysis",
    "Time and attendance for staff",
  ],
  "Small enterprises": [
    "Everything in one place — from day one",
    "Scales to multi-branch as you grow",
    "Start free, upgrade only when needed",
    "Free-of-charge onboarding flows",
  ],
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        overline="Solutions"
        title="Built for how your industry actually works"
        description="BIZFLOW adapts to the way different businesses manage stock, sales, money, and people. Here's how it fits each sector."
      />

      <Section>
        <div className="space-y-6">
          {industries.map(({ icon: Icon, name, description }) => (
            <Card key={name}>
              <CardContent className="grid gap-6 p-6 pt-6 md:grid-cols-[auto_1fr_2fr] md:items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-accent/10 text-accent">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold">{name}</h3>
                  <p className="mt-1 text-sm text-muted">{description}</p>
                </div>
                <ul className="space-y-1.5">
                  {deepDives[name]?.map((d) => (
                    <li key={d} className="text-sm text-muted">
                      · {d}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="!py-16">
        <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-accent/5 to-transparent p-10 text-center">
          <h2 className="font-heading text-2xl font-semibold">Don&apos;t see your industry?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            If you run a business with inventory, customers, or money, BIZFLOW fits. Tell us about yours — we listen.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/contact">Talk to us <ArrowRight /></Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/features">See all features</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}