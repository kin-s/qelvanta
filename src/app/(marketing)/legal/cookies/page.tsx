import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Cookie policy (placeholder) — BIZFLOW",
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie policy"
      lastUpdated="placeholder"
      sections={[
        {
          heading: "1. What are cookies",
          body: [
            "Cookies are small files stored in your browser that help a website remember your preferences.",
          ],
        },
        {
          heading: "2. What BIZFLOW uses",
          body: [
            "Strictly necessary cookies: session state, theme preference (dark/light/system).",
            "During the current frontend phase, the application stores theme preference in localStorage, not cookies.",
            "Analytics cookies (opt-in only) will be added when analytics is enabled.",
          ],
        },
        {
          heading: "3. Managing cookies",
          body: [
            "You can control cookies through your browser settings.",
            "Disabling strictly necessary cookies may break parts of the application.",
          ],
        },
      ]}
    />
  );
}