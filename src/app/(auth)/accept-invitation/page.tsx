"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PasswordInput } from "@/components/auth/password-input";
import { DemoNotice } from "@/components/auth/demo-notice";
import { authService } from "@/services";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Za-z]/, "Include at least one letter")
      .regex(/\d/, "Include at least one number"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

// Demo invitation data — real data arrives from server with the invitation
const DEMO_TOKEN = "demo-invite-token";
const DEMO_ORG = "Acme Ltd";
const DEMO_EMAIL = "invited@acme.example";
const DEMO_ROLE = "Manager";

export default function AcceptInvitationPage() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    try {
      await authService.acceptInvitation(DEMO_TOKEN, values.password);
      setAccepted(true);
      toast.success("Invitation accepted (simulated)", {
        description: "Redirecting to onboarding…",
      });
      setTimeout(() => router.push("/onboarding"), 1500);
    } catch (error) {
      toast.error("Could not accept invitation", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  return (
    <>
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
          <UserPlus className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-semibold">
            You&apos;ve been invited
          </h1>
          <p className="mt-1 text-sm text-muted">
            Join <strong className="text-foreground">{DEMO_ORG}</strong> on BIZFLOW.
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-md border border-border bg-surface/60 p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted">Organization</span>
          <span className="font-medium text-foreground">{DEMO_ORG}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-muted">Email</span>
          <span className="text-foreground">{DEMO_EMAIL}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-muted">Role</span>
          <Badge variant="accent">{DEMO_ROLE}</Badge>
        </div>
      </div>

      {accepted ? (
        <div className="rounded-md border border-success/40 bg-success/10 p-4 text-sm">
          <p className="font-medium text-success">Invitation accepted</p>
          <p className="mt-1 text-muted">
            Redirecting… If nothing happens,{" "}
            <Link href="/onboarding" className="text-accent hover:underline">
              click here
            </Link>
            .
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="password">Create a password</Label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              {...register("password")}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-xs text-danger">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <PasswordInput
              id="confirm"
              autoComplete="new-password"
              placeholder="Repeat your password"
              {...register("confirm")}
              aria-invalid={!!errors.confirm}
            />
            {errors.confirm && (
              <p className="text-xs text-danger">{errors.confirm.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Accepting…" : "Accept invitation"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted">
        Wrong account?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Sign in instead
        </Link>
      </p>

      <DemoNotice>
        Invitation acceptance is simulated — the org name, role, and email are
        hardcoded placeholders. Real invitations will be validated server-side.
      </DemoNotice>
    </>
  );
}