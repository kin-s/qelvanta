import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Section, SectionHeader } from "@/components/marketing/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About — BIZFLOW",
  description:
    "BIZFLOW is a modern business operating system for small and medium-sized businesses worldwide.",
};

const values = [
  { title: "Clarity over clutter", body: "Every screen answers a real business question. Nothing decorative, nothing wasted." },
  { title: "One system, no islands", body: "Inventory, sales, finance, people, and reporting share the same source of truth." },
  { title: "Honest by default", body: "No fake metrics, no invented testimonials. Everything in BIZFLOW shows what it actually represents." },
  { title: "Built for the real world", body: "Multi-currency, multi-branch, multi-lingual — designed to travel beyond one country or market." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        overline="About"
        title="A modern operating system for serious businesses"
        description="BIZFLOW exists because running a business shouldn't mean juggling five disconnected tools. We're building one platform that does the work."
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-6 text-base text-muted">
          <p>
            Small and medium-sized businesses are the backbone of the global economy.
            Yet most still manage inventory in one tool, finances in another, customers
            in a third, and reports in spreadsheets stitched together by hand.
          </p>
          <p>
            That fragmentation costs time and money — and it makes real-time clarity
            nearly impossible. BIZFLOW is built to replace that sprawl with a single
            platform: inventory, sales, finance, CRM, employees, reporting, AI, and
            automation, all sharing the same data.
          </p>
          <p>
            We&apos;re building it in the open: frontend first, backend ready, with a clear
            separation between what&apos;s simulated during development and what will be
            production-ready at launch. No dark patterns, no fake partnerships, no
            invented numbers.
          </p>
        </div>
      </Section>

      <Section className="bg-surface/40">
        <SectionHeader
          overline="Values"
          title="What we optimize for"
          description="Four principles that shape every decision in the product."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {values.map((v) => (
            <Card key={v.title}>
              <CardContent className="p-6 pt-6">
                <h3 className="font-heading text-base font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted">{v.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-2xl font-semibold">Frontend-first, backend-ready</h2>
          <p className="mt-4 text-sm text-muted">
            This product is currently a frontend demonstration. Real authentication,
            payments, email, AI, and data persistence arrive with the backend phase.
            Everything you see here is architected so that integration is a replacement
            of mock services — not a rewrite.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/contact">Get in touch <ArrowRight /></Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/features">See features</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}