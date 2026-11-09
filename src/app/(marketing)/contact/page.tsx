import type { Metadata } from "next";
import { Mail, MessageSquare, Building2 } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/marketing/contact-form";

export const metadata: Metadata = {
  title: "Contact — BIZFLOW",
  description: "Get in touch with the BIZFLOW team. Sales, support, and general enquiries.",
};

const channels = [
  { icon: Mail, title: "Email", body: "hello@bizflow.example (placeholder)", note: "Real address arrives with launch." },
  { icon: MessageSquare, title: "Support", body: "Use the contact form →", note: "Simulated during development." },
  { icon: Building2, title: "Sales", body: "Contact form below", note: "Route to sales will be live in backend phase." },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        overline="Contact"
        title="We'd love to hear from you"
        description="Sales questions, product feedback, or just want to see if BIZFLOW fits your business — send us a message."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div className="space-y-4">
            {channels.map(({ icon: Icon, title, body, note }) => (
              <Card key={title}>
                <CardContent className="flex items-start gap-3 p-5 pt-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-semibold">{title}</h3>
                    <p className="mt-0.5 text-sm text-foreground">{body}</p>
                    <p className="mt-1 text-xs text-muted">{note}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-6 pt-6 sm:p-8 sm:pt-8">
              <h2 className="font-heading text-lg font-semibold">Send a message</h2>
              <p className="mt-1 text-sm text-muted">
                Fields marked * are required.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}