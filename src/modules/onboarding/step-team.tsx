"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StepShell, StepFooter } from "./step-shell";
import { updateOnboarding, useOnboardingData } from "./store";
import { teamRoles } from "@/config/onboarding";
import type { StepProps, OnboardingInvite } from "./types";

export function StepTeam({ onNext, onBack, onSkip }: StepProps) {
  const data = useOnboardingData();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("Manager");
  const [error, setError] = useState<string>("");

  function add() {
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    const invite: OnboardingInvite = {
      id: "inv_" + Math.random().toString(36).slice(2, 10),
      name: name.trim(),
      email: email.trim(),
      role,
    };
    updateOnboarding({ invites: [...data.invites, invite] });
    setName("");
    setEmail("");
    setRole("Manager");
    setError("");
  }

  function remove(id: string) {
    updateOnboarding({ invites: data.invites.filter((i) => i.id !== id) });
  }

  return (
    <StepShell
      title="Invite your team"
      description="Add teammates now or skip and invite them later from settings."
      footer={<StepFooter onBack={onBack} onNext={onNext} onSkip={onSkip} />}
    >
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
          <div className="space-y-1.5">
            <Label htmlFor="teamName" className="text-xs">Name</Label>
            <Input
              id="teamName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Amina Kimani"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="teamEmail" className="text-xs">Email</Label>
            <Input
              id="teamEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="amina@acme.example"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="teamRole" className="text-xs">Role</Label>
            <Select
              id="teamRole"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {teamRoles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </Select>
          </div>
          <Button type="button" onClick={add} size="default">
            <Plus />
            Add
          </Button>
        </div>
        {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      </div>

      {data.invites.length === 0 ? (
        <p className="rounded-md border border-dashed border-border bg-surface/40 p-6 text-center text-sm text-muted">
          No teammates added yet. You can invite them later.
        </p>
      ) : (
        <ul className="space-y-2">
          {data.invites.map((i) => (
            <li
              key={i.id}
              className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{i.name}</p>
                <p className="truncate text-xs text-muted">{i.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="accent">{i.role}</Badge>
                <button
                  type="button"
                  onClick={() => remove(i.id)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-danger"
                  aria-label={`Remove ${i.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-muted">
        Invitations are simulated — no email is sent. Real invites will be
        delivered once email service is connected in the backend phase.
      </p>
    </StepShell>
  );
}