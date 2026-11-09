"use client";

import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DemoNotice } from "@/components/auth/demo-notice";

export default function VerifyEmailPage() {
  function resend() {
    toast("Verification email re-sent (simulated)", {
      description: "No email was actually sent.",
    });
  }

  return (
    <>
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-semibold">Verify your email</h1>
          <p className="mt-1 text-sm text-muted">
            We&apos;ve sent a verification link to your email address. Click the
            link in the message to activate your account.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Button variant="secondary" className="w-full" onClick={resend}>
          Resend verification email
        </Button>
        <Button asChild variant="ghost" className="w-full">
          <Link href="/login">
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </Button>
      </div>

      <DemoNotice>
        No email was actually sent. In the backend phase, this page will
        receive a real token and confirm the verification server-side.
      </DemoNotice>
    </>
  );
}