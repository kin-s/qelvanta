"use client";

import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { StepShell, StepFooter } from "./step-shell";
import { updateOnboarding, useOnboardingData } from "./store";
import {
  currencies,
  timezones,
  languages,
  dateFormats,
  numberFormats,
  countries,
} from "@/config/onboarding";
import type { StepProps } from "./types";

export function StepRegional({ onNext, onBack }: StepProps) {
  const data = useOnboardingData();
  const selectedCountry = countries.find((c) => c.code === data.country);

  return (
    <StepShell
      title="Regional preferences"
      description="Set your base currency, timezone, and formats. You can override per record later."
      footer={<StepFooter onBack={onBack} onNext={onNext} />}
    >
      {selectedCountry && (
        <p className="rounded-md border border-border bg-surface/60 px-4 py-3 text-xs text-muted">
          Based on <strong className="text-foreground">{selectedCountry.name}</strong>, we
          suggest <strong className="text-foreground">{selectedCountry.currency}</strong>{" "}
          and <strong className="text-foreground">{selectedCountry.timezone}</strong>. Change freely.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="baseCurrency">Base reporting currency</Label>
          <Select
            id="baseCurrency"
            value={data.baseCurrency}
            onChange={(e) => updateOnboarding({ baseCurrency: e.target.value })}
          >
            {currencies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
          <p className="text-xs text-muted">
            Transactions in other currencies use ISO codes; reports convert to this one.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select
            id="timezone"
            value={data.timezone}
            onChange={(e) => updateOnboarding({ timezone: e.target.value })}
          >
            {timezones.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select
            id="language"
            value={data.language}
            onChange={(e) => updateOnboarding({ language: e.target.value })}
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateFormat">Date format</Label>
          <Select
            id="dateFormat"
            value={data.dateFormat}
            onChange={(e) => updateOnboarding({ dateFormat: e.target.value })}
          >
            {dateFormats.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="numberFormat">Number format</Label>
        <Select
          id="numberFormat"
          value={data.numberFormat}
          onChange={(e) => updateOnboarding({ numberFormat: e.target.value })}
        >
          {numberFormats.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </Select>
      </div>
    </StepShell>
  );
}