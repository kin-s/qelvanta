"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/password-input";
import { SocialButtons } from "@/components/auth/social-buttons";
import { DemoNotice } from "@/components/auth/demo-notice";
import { registerUser } from "@/actions/auth";

const schema = z
  .object({
    name: z.string().min(2, "Please enter your full name"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
    terms: z.boolean().refine((v) => v === true, { message: "You must accept the terms to continue" }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { terms: false },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    const res = await registerUser({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (res?.error) {
      toast.error("Registration failed", { description: res.error });
      setIsLoading(false);
    } else if (res?.success) {
      toast.success("Account created!", { description: "Please sign in with your new account." });
      router.push("/login");
    }
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold">Create your account</h1>
        <p className="mt-1 text-sm text-muted">Start free. No credit card required.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" autoComplete="name" placeholder="Amina Kimani" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@business.com" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput id="password" autoComplete="new-password" placeholder="At least 8 characters" {...register("password")} aria-invalid={!!errors.password} />
          {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <PasswordInput id="confirm" autoComplete="new-password" placeholder="Repeat your password" {...register("confirm")} aria-invalid={!!errors.confirm} />
          {errors.confirm && <p className="text-xs text-danger">{errors.confirm.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="flex items-start gap-2 text-sm text-muted">
            <input type="checkbox" {...register("terms")} className="mt-0.5 h-4 w-4 rounded border-border accent-accent" />
            <span>
              I agree to the <Link href="/legal/terms" className="text-accent underline-offset-4 hover:underline">Terms of Service</Link> and <Link href="/legal/privacy" className="text-accent underline-offset-4 hover:underline">Privacy Policy</Link>.
            </span>
          </label>
          {errors.terms && <p className="text-xs text-danger">{errors.terms.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted">
        <div className="h-px flex-1 bg-border" />
        or continue with
        <div className="h-px flex-1 bg-border" />
      </div>

      <SocialButtons />

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">Sign in</Link>
      </p>

      <DemoNotice>
        Registration is now securely connected to the database using bcrypt encryption.
      </DemoNotice>
    </>
  );
}