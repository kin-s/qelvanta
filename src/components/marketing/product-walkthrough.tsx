import { Section, SectionHeader } from "./section";
import { walkthroughSteps } from "@/config/marketing";

export function ProductWalkthrough() {
  return (
    <Section>
      <SectionHeader
        overline="See it work"
        title="From product to profit — in five steps"
        description="A single workflow: register a product, sell it, watch inventory update, track the cost, and see the impact on your business."
      />

      <div className="relative">
        <div
          aria-hidden
          className="absolute left-0 right-0 top-6 hidden h-px bg-border md:block"
        />
        <div className="grid gap-8 md:grid-cols-5">
          {walkthroughSteps.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-card font-heading text-base font-semibold text-accent md:mx-0">
                {i + 1}
              </div>
              <h3 className="mt-4 font-heading text-base font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}