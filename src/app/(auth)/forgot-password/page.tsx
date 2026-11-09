"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DemoNotice } from "@/components/auth/demo-notice";
import { authService } from "@/services";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    try {
      await authService.forgotPassword(values.email);
      setSubmitted(true);
      toast.success("Reset link prepared (simulated)", {
        description: "No email was actually sent.",
      });
    } catch (error) {
      toast.error("Could not process request", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  if (submitted) {
    return (
      <>
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-semibold">Check your inbox</h1>
            <p className="mt-1 text-sm text-muted">
              If an account exists for <strong className="text-foreground">{getValues("email")}</strong>, we would send a reset link.
            </p>
          </div>
        </div>

        <DemoNotice>
          No email was actually sent. Real email delivery arrives with the
          backend phase. In production, the link would expire after 30 minutes
          and be single-use.
        </DemoNotice>

        <Button
          variant="secondary"
          className="mt-6 w-full"
          onClick={() => setSubmitted(false)}
        >
          Try another email
        </Button>

        <p className="mt-4 text-center text-sm text-muted">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-accent hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-semibold">Forgot password?</h1>
          <p className="mt-1 text-sm text-muted">
            Enter your email and we&apos;ll send a reset link.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@business.com"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-danger">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-accent hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      </p>

      <DemoNotice>
        This is a demonstration — no email is sent, and no reset link actually
        exists.
      </DemoNotice>
    </>
  );
}