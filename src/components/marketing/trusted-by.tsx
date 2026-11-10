import { Section } from "./section";

const partners = ["Acme Corp", "Globex", "Initech", "Umbrella", "Stark Ind"];

export function TrustedBy() {
  return (
    <Section className="!py-12 border-y border-border">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Trusted by growing businesses worldwide
        </p>
        <div className="mt-8 grid grid-cols-2 gap-6 opacity-50 sm:grid-cols-5">
          {partners.map((name) => (
            <div
              key={name}
              className="flex h-10 items-center justify-center rounded-md text-sm font-heading font-semibold tracking-wider text-foreground"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}