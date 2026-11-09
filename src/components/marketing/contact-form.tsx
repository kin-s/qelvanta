"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  company: z.string().optional(),
  subject: z.string().min(3, "Add a short subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    // Simulated submission — real email is sent only in the backend phase.
    await new Promise((r) => setTimeout(r, 700));
    toast.success("Message queued (simulated)", {
      description: `We've received your message, ${values.name.split(" ")[0]}. A real email will be sent in the backend phase.`,
    });
    setSubmitted(true);
    reset();
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-success/30 bg-success/5 p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-success" />
        <h3 className="mt-4 font-heading text-lg font-semibold">Message received</h3>
        <p className="mt-2 max-w-sm text-sm text-muted">
          This was a simulated submission — no email was actually sent. Real
          email delivery arrives with the backend phase.
        </p>
        <Button variant="secondary" className="mt-6" onClick={() => setSubmitted(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Full name *</Label>
          <Input id="contact-name" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email *</Label>
          <Input id="contact-email" type="email" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-company">Company</Label>
        <Input id="contact-company" {...register("company")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-subject">Subject *</Label>
        <Input id="contact-subject" {...register("subject")} aria-invalid={!!errors.subject} />
        {errors.subject && <p className="text-xs text-danger">{errors.subject.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Message *</Label>
        <Textarea
          id="contact-message"
          rows={6}
          {...register("message")}
          aria-invalid={!!errors.message}
        />
        {errors.message && <p className="text-xs text-danger">{errors.message.message}</p>}
      </div>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          This is a demonstration form — no email is sent. Real submissions
          arrive with the backend phase.
        </p>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            "Sending…"
          ) : (
            <>
              <Send />
              Send message
            </>
          )}
        </Button>
      </div>
    </form>
  );
}