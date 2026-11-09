export interface OnboardingInvite {
  id: string;
  name: string;
  email: string;
  role: string;
}

export type BusinessStructure = "single" | "branches" | "warehouse" | "";

export interface OnboardingData {
  currentStep: number;
  completed: boolean;

  // Step 2 — Business details
  businessName: string;
  businessType: string;
  industry: string;
  description: string;
  country: string;
  businessEmail: string;
  phone: string;
  website: string;

  // Step 3 — Regional
  baseCurrency: string;
  timezone: string;
  language: string;
  dateFormat: string;
  numberFormat: string;

  // Step 4 — Structure
  structure: BusinessStructure;

  // Step 5 — Modules
  modules: string[];

  // Step 6 — Team
  invites: OnboardingInvite[];
}

export interface StepProps {
  onNext: () => void;
  onBack: () => void;
  onSkip?: () => void;
  onFinish?: () => void;
}