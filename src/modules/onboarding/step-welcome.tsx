import { CheckCircle2, Boxes, BarChart3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { ArrowRight } from "lucide-react";
import type { StepProps } from "./types";

export function StepWelcome({ onNext }: StepProps) {
  return (
    <div className="mx-auto w-full max-w-3xl text-center">
      <div className="mb-8 inline-flex">
        <Logo size="lg" />
      </div>

      <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        Welcome to QELVANTA
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base text-muted">
        Let&apos;s set up your workspace. It takes about three minutes and you
        can change everything later.
      </p>

      <div className="mx-auto mt-12 grid max-w-2xl gap-4 sm:grid-cols-3">
        {[
          { icon: Boxes, title: "Everything connected", body: "Inventory, sales, finance, CRM — one source of truth." },
          { icon: BarChart3, title: "Clarity from day one", body: "Live dashboards, filtered reports, export-ready." },
          { icon: Users, title: "Ready for your team", body: "Roles and permissions built in from the start." },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-lg border border-border bg-card p-5 text-left">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-accent/10 text-accent">
              <Icon className="h-4 w-4" />
            </div>
            <h3 className="font-heading text-sm font-semibold">{title}</h3>
            <p className="mt-1 text-xs text-muted">{body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center gap-4">
        <Button size="lg" onClick={onNext}>
          Get started
          <ArrowRight />
        </Button>
        <div className="flex items-center gap-2 text-xs text-muted">
          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
          No credit card required
        </div>
      </div>
    </div>
  );
}