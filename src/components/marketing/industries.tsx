import { Section, SectionHeader } from "./section";
import { industries } from "@/config/marketing";
import { Card, CardContent } from "@/components/ui/card";

export function Industries() {
  return (
    <Section id="solutions" className="bg-surface/40">
      <SectionHeader
        overline="Solutions"
        title="Built for the way your industry works"
        description="From single-location retailers to multi-warehouse distributors, BIZFLOW adapts to your operations."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map(({ icon: Icon, name, description }) => (
          <Card key={name} className="transition-colors hover:border-accent/40">
            <CardContent className="flex items-start gap-4 p-6 pt-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-base font-semibold">{name}</h3>
                <p className="mt-1 text-sm text-muted">{description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}