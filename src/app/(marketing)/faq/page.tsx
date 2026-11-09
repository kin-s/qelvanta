import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqs } from "@/config/marketing";

export const metadata: Metadata = {
  title: "FAQ — BIZFLOW",
  description: "Common questions about BIZFLOW: features, plans, multi-branch support, currencies, privacy, and more.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        overline="FAQ"
        title="Questions, answered"
        description="If we haven't covered it, get in touch — we read every message."
      />

      <Section className="!pt-12">
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible>
            {faqs.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-sm sm:text-base">{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      <Section className="!py-16">
        <div className="mx-auto max-w-2xl rounded-xl border border-accent/30 bg-gradient-to-br from-accent/5 to-transparent p-10 text-center">
          <h2 className="font-heading text-xl font-semibold">Still have a question?</h2>
          <p className="mt-3 text-sm text-muted">We typically respond within one business day.</p>
          <Button className="mt-6" asChild>
            <Link href="/contact">Contact us <ArrowRight /></Link>
          </Button>
        </div>
      </Section>
    </>
  );
}