"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

// Demo token — real token arrives via URL from the reset email in production
const DEMO_TOKEN = "demo-reset-token";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    try {
      await authService.resetPassword(DEMO_TOKEN, values.password);
      setDone(true);
      toast.success("Password updated (simulated)", {
        description: "No password was actually stored. Redirecting…",
      });
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      toast.error("Could not reset password", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  return (
    <>
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-semibold">Set a new password</h1>
          <p className="mt-1 text-sm text-muted">
            Choose a strong password you haven&apos;t used before.
          </p>
        </div>
      </div>

      {done ? (
        <div className="rounded-md border border-success/40 bg-success/10 p-4 text-sm">
          <p className="font-medium text-success">Password updated</p>
          <p className="mt-1 text-muted">
            Redirecting to sign in… If nothing happens,{" "}
            <Link href="/login" className="text-accent hover:underline">
              click here
            </Link>
            .
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
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
            {isSubmitting ? "Updating…" : "Update password"}
          </Button>
        </form>
      )}

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
        Password reset is simulated — no password is stored, and the demo token
        is hardcoded. Real reset tokens will be generated server-side.
      </DemoNotice>
    </>
  );
}