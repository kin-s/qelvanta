import { X, Check } from "lucide-react";
import { Section, SectionHeader } from "./section";
import { Card, CardContent } from "@/components/ui/card";

const problems = [
  "Stock numbers never match reality",
  "Sales in one tool, expenses in another",
  "Invoices chased over WhatsApp",
  "Reports stitched together in spreadsheets",
  "Staff permissions scattered across logins",
];

const solutions = [
  "Real-time inventory across every location",
  "One ledger for sales, expenses, and cash flow",
  "Invoices, quotations, and reminders built in",
  "Live dashboards you can filter and export",
  "Role-based access down to the module",
];

export function ProblemSolution() {
  return (
    <Section>
      <SectionHeader
        overline="The problem"
        title="Disconnected tools slow your business down"
        description="Every extra tool costs you time, money, and clarity. BIZFLOW replaces them with one operating system built for the way you actually work."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-danger/30">
          <CardContent className="p-6 pt-6">
            <h3 className="mb-4 font-heading text-lg font-semibold text-danger">
              Without BIZFLOW
            </h3>
            <ul className="space-y-3">
              {problems.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-muted">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                  {p}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-accent/30">
          <CardContent className="p-6 pt-6">
            <h3 className="mb-4 font-heading text-lg font-semibold text-accent">
              With BIZFLOW
            </h3>
            <ul className="space-y-3">
              {solutions.map((s) => (
                <li key={s} className="flex items-start gap-3 text-sm text-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}