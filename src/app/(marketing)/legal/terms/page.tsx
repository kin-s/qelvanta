import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Terms of service (placeholder) — BIZFLOW",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      lastUpdated="placeholder"
      sections={[
        {
          heading: "1. Acceptance",
          body: [
            "By using BIZFLOW you agree to these Terms of Service (placeholder).",
            "During the current frontend-development phase, no legally binding agreement exists.",
          ],
        },
        {
          heading: "2. Use of the service",
          body: [
            "You agree to use BIZFLOW only for lawful business purposes.",
            "You are responsible for the accuracy of the data you enter.",
          ],
        },
        {
          heading: "3. Subscriptions and billing",
          body: [
            "Plan pricing, billing cycles, and refunds will be governed by the terms shown at the time of purchase once billing is live.",
            "Currently all billing actions are simulated.",
          ],
        },
        {
          heading: "4. Service availability",
          body: [
            "We aim for high availability but cannot guarantee uninterrupted service.",
            "Support SLAs depend on your plan.",
          ],
        },
        {
          heading: "5. Liability",
          body: [
            "Liability limits, warranty disclaimers, and indemnification clauses will be finalized with legal review before launch.",
          ],
        },
      ]}
    />
  );
}