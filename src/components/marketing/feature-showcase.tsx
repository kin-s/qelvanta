import { Section, SectionHeader } from "./section";
import { Card, CardContent } from "@/components/ui/card";
import { features } from "@/config/marketing";

export function FeatureShowcase() {
  return (
    <Section id="features" className="bg-surface/40">
      <SectionHeader
        overline="Features"
        title="Everything your business needs. In one place."
        description="Eight integrated modules that share the same data, permissions, and reporting — so nothing gets lost between tools."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="border-border/80 transition-colors hover:border-accent/40">
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
  );
}