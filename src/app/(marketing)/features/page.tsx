import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Section, SectionHeader } from "@/components/marketing/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { features } from "@/config/marketing";

export const metadata: Metadata = {
  title: "Features — BIZFLOW",
  description:
    "Inventory, sales, finance, CRM, employees, analytics, AI and automation — all in one business operating system.",
};

const detailed = [
  {
    key: "Inventory",
    bullets: [
      "Track stock across unlimited locations and warehouses",
      "Low-stock and out-of-stock alerts with reorder suggestions",
      "Full movement history: sales, returns, transfers, adjustments",
      "Product variants: size, colour, model, custom attributes",
      "Barcode-ready interface for fast stock checks",
    ],
  },
  {
    key: "Sales & POS",
    bullets: [
      "Keyboard-first point of sale: barcode, quantity, checkout",
      "Multiple payment methods: cash, card, transfer, digital wallet",
      "Customer selection at checkout with saved profiles",
      "Instant receipt preview and print",
      "Returns and refunds with full audit trail",
    ],
  },
  {
    key: "Finance",
    bullets: [
      "Expenses with categories, receipts, and supplier links",
      "Income records with source and reference tracking",
      "Cash flow visualization: inflows, outflows, net movement",
      "Accounts receivable and payable with aging",
      "Management profit & loss with clear disclaimer",
    ],
  },
  {
    key: "CRM",
    bullets: [
      "Customer profiles with full purchase history",
      "Segments: new, regular, VIP, inactive, wholesale, corporate",
      "Outstanding balances and credit limits",
      "Activity timeline and communication notes",
      "One-click invoice creation from a customer profile",
    ],
  },
  {
    key: "Employees",
    bullets: [
      "Directory with departments, positions, and managers",
      "Attendance: check-in, check-out, late arrivals, absences",
      "Leave requests with approval workflow",
      "Shift scheduling and weekly calendar",
      "Payroll records (interface — statutory logic added with backend)",
    ],
  },
  {
    key: "Analytics",
    bullets: [
      "Configurable date-range dashboards (today → custom)",
      "Revenue, expenses, profit, sales, inventory — filtered",
      "Reports by product, category, branch, employee, payment method",
      "CSV export, print, PDF (where supported)",
      "Consolidated multi-branch comparisons",
    ],
  },
  {
    key: "AI Assistant",
    bullets: [
      "Ask plain-language questions about your own business",
      "Suggested questions for common insights",
      "Grounding: answers cite the records they're based on",
      "Insight cards surface trends and warnings",
      "Backend-phase authorization: only data the user can access",
    ],
  },
  {
    key: "Automation",
    bullets: [
      "Stock alerts when items fall below reorder level",
      "Overdue invoice reminders to customers",
      "Daily sales summaries to managers",
      "Expense anomaly notifications",
      "Shift reminders for scheduled employees",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        overline="Features"
        title="One operating system for your entire business"
        description="Every module shares the same data, permissions, and reporting layer. No integrations required, no sync delays, no tool sprawl."
      >
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/register">Start for free <ArrowRight /></Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/pricing">View pricing</Link>
          </Button>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="border-border/80">
              <CardContent className="p-6 pt-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-base font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-surface/40">
        <SectionHeader
          overline="In depth"
          title="What each module actually does"
          description="A closer look at the workflows inside every BIZFLOW module."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {detailed.map((d) => (
            <Card key={d.key}>
              <CardContent className="p-6 pt-6">
                <h3 className="font-heading text-lg font-semibold">{d.key}</h3>
                <ul className="mt-4 space-y-2.5">
                  {d.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {b}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-accent/5 to-transparent p-10 text-center">
          <h2 className="font-heading text-2xl font-semibold">Ready to see it in action?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            Start on the free plan. Upgrade whenever you outgrow it.
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