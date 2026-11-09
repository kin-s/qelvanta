import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Privacy policy (placeholder) — BIZFLOW",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      lastUpdated="placeholder"
      sections={[
        {
          heading: "1. Overview",
          body: [
            "This Privacy Policy (placeholder) describes how BIZFLOW would collect, use, and protect your information.",
            "BIZFLOW is currently a frontend demonstration. No data leaves your browser during development — no analytics, no tracking, no third-party calls.",
          ],
        },
        {
          heading: "2. What we would collect",
          body: [
            "Account information: name, email, organization details.",
            "Business data: inventory, sales, customers, suppliers, employees, and financial records you create.",
            "Usage data: which features you use, for product improvement (opt-in).",
          ],
        },
        {
          heading: "3. How we'd use it",
          body: [
            "To provide the service — display your own business data back to you.",
            "To send service notifications, reminders, and support responses.",
            "Never sold to third parties. Never used to train external models without your explicit opt-in.",
          ],
        },
        {
          heading: "4. Data isolation",
          body: [
            "Your organization's data will be isolated from other organizations' data at the database and application layer.",
            "Role-based access controls limit what each team member can see.",
          ],
        },
        {
          heading: "5. Contact",
          body: [
            "Questions about this placeholder should go through the contact form on this site.",
          ],
        },
      ]}
    />
  );
}