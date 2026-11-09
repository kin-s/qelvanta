import { Section, SectionHeader } from "./section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/config/marketing";

export function FaqPreview() {
  return (
    <Section id="faq" className="bg-surface/40">
      <SectionHeader
        overline="FAQ"
        title="Questions, answered"
        description="Everything you need to know before getting started with BIZFLOW."
      />

      <div className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-sm sm:text-base">
                {item.q}
              </AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}