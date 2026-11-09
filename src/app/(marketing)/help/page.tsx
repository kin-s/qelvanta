import type { Metadata } from "next";
import Link from "next/link";
import { Book, FileText, LifeBuoy, ArrowRight, Search } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Help centre — BIZFLOW",
  description: "Documentation, guides, and support resources for BIZFLOW.",
};

const resources = [
  { icon: Book, title: "Getting started", body: "Set up your business, invite your team, and add your first product." },
  { icon: FileText, title: "Product guides", body: "Step-by-step walkthroughs for every module." },
  { icon: LifeBuoy, title: "Contact support", body: "Reach a human when self-serve isn't enough." },
];

export default function HelpPage() {
  return (
    <>
      <PageHero
        overline="Help centre"
        title="How can we help?"
        description="Guides, walkthroughs, and answers to common questions — everything you need to get productive in BIZFLOW."
      >
        <div className="mx-auto max-w-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input className="h-11 pl-10" placeholder="Search the help centre… (demo)" />
          </div>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-4 sm:grid-cols-3">
          {resources.map(({ icon: Icon, title, body }) => (
            <Card key={title}>
              <CardContent className="p-6 pt-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-base font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="rounded-xl border border-dashed border-border bg-surface/40 p-10 text-center">
          <h2 className="font-heading text-lg font-semibold">Full documentation coming soon</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
            We&apos;re building a complete help centre alongside the product. In the meantime, the FAQ covers the most common questions.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="secondary">
              <Link href="/faq">Read the FAQ <ArrowRight /></Link>
            </Button>
            <Button asChild>
              <Link href="/contact">Contact support <ArrowRight /></Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}