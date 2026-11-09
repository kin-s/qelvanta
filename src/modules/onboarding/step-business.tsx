"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StepShell, StepFooter } from "./step-shell";
import { updateOnboarding, useOnboardingData } from "./store";
import { businessTypes, industries, countries } from "@/config/onboarding";
import type { StepProps } from "./types";

type Errors = Partial<Record<string, string>>;

export function StepBusiness({ onNext, onBack }: StepProps) {
  const data = useOnboardingData();
  const [errors, setErrors] = useState<Errors>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((p) => ({ ...p, logo: "Please upload an image file" }));
      return;
    }
    if (file.size > 500_000) {
      setErrors((p) => ({ ...p, logo: "Image must be under 500 KB" }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
    setErrors((p) => ({ ...p, logo: undefined }));
  }

  function clearLogo() {
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function validate(): boolean {
    const errs: Errors = {};
    if (data.businessName.trim().length < 2) errs.businessName = "Enter your business name";
    if (!data.businessType) errs.businessType = "Choose a business type";
    if (!data.industry) errs.industry = "Choose an industry";
    if (!data.country) errs.country = "Choose a country";
    if (!data.businessEmail) errs.businessEmail = "Business email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.businessEmail))
      errs.businessEmail = "Enter a valid email";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (validate()) onNext();
  }

  function onCountryChange(code: string) {
    const country = countries.find((c) => c.code === code);
    updateOnboarding({
      country: code,
      baseCurrency: country?.currency ?? data.baseCurrency,
      timezone: country?.timezone ?? data.timezone,
    });
  }

  return (
    <StepShell
      title="Business details"
      description="Tell us about the business you're setting up."
      footer={<StepFooter onBack={onBack} onNext={handleNext} />}
    >
      <div className="space-y-2">
        <Label htmlFor="businessName">Business name *</Label>
        <Input
          id="businessName"
          value={data.businessName}
          onChange={(e) => updateOnboarding({ businessName: e.target.value })}
          aria-invalid={!!errors.businessName}
          placeholder="Acme Ltd"
        />
        {errors.businessName && <p className="text-xs text-danger">{errors.businessName}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="businessType">Business type *</Label>
          <Select
            id="businessType"
            value={data.businessType}
            onChange={(e) => updateOnboarding({ businessType: e.target.value })}
            aria-invalid={!!errors.businessType}
          >
            <option value="">Select…</option>
            {businessTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
          {errors.businessType && <p className="text-xs text-danger">{errors.businessType}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry *</Label>
          <Select
            id="industry"
            value={data.industry}
            onChange={(e) => updateOnboarding({ industry: e.target.value })}
            aria-invalid={!!errors.industry}
          >
            <option value="">Select…</option>
            {industries.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </Select>
          {errors.industry && <p className="text-xs text-danger">{errors.industry}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Business description</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => updateOnboarding({ description: e.target.value })}
          placeholder="A short description of what your business does…"
          rows={3}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Select
            id="country"
            value={data.country}
            onChange={(e) => onCountryChange(e.target.value)}
            aria-invalid={!!errors.country}
          >
            <option value="">Select…</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </Select>
          {errors.country && <p className="text-xs text-danger">{errors.country}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessEmail">Business email *</Label>
          <Input
            id="businessEmail"
            type="email"
            value={data.businessEmail}
            onChange={(e) => updateOnboarding({ businessEmail: e.target.value })}
            aria-invalid={!!errors.businessEmail}
            placeholder="hello@acme.example"
          />
          {errors.businessEmail && <p className="text-xs text-danger">{errors.businessEmail}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => updateOnboarding({ phone: e.target.value })}
            placeholder="+1 555 0100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={data.website}
            onChange={(e) => updateOnboarding({ website: e.target.value })}
            placeholder="https://acme.example"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Business logo</Label>
        <div className="flex items-center gap-4">
          {logoPreview ? (
            <div className="relative">
              <Image
                src={logoPreview}
                alt="Business logo preview"
                width={64}
                height={64}
                unoptimized
                className="h-16 w-16 rounded-md border border-border bg-surface object-cover"
              />
              <button
                type="button"
                onClick={clearLogo}
                className="absolute -right-2 -top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-danger text-white"
                aria-label="Remove logo"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-md border border-dashed border-border text-muted">
              <Upload className="h-5 w-5" />
            </div>
          )}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogo}
              className="hidden"
              id="logo-upload"
            />
            <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
              Choose image
            </Button>
            <p className="mt-1 text-xs text-muted">
              Preview only — logo persistence arrives with the backend phase.
            </p>
            {errors.logo && <p className="mt-1 text-xs text-danger">{errors.logo}</p>}
          </div>
        </div>
      </div>
    </StepShell>
  );
}