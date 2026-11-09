import { Section } from "./section";

const slots = ["Company one", "Company two", "Company three", "Company four", "Company five"];

export function TrustedBy() {
  return (
    <Section className="!py-12 border-y border-border">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Trusted by growing businesses — logos added as partners onboard
        </p>
        <div className="mt-8 grid grid-cols-2 gap-6 opacity-50 sm:grid-cols-5">
          {slots.map((slot, i) => (
            <div
              key={slot}
              className="flex h-10 items-center justify-center rounded-md border border-dashed border-border text-[10px] uppercase tracking-wider text-muted"
            >
              Placeholder {i + 1}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}