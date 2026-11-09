"use client";

import { useState } from "react";
import { Plus, Zap, PlayCircle, PauseCircle, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import { SEED_AUTOMATIONS } from "@/data/automations";
import { TRIGGER_LABELS, type Automation } from "@/types/automations";
import { AutomationForm } from "./automation-form";
import { formatDate } from "@/lib/utils";

export function AutomationsClient() {
  const [automations, setAutomations] = useLocalStorageState<Automation[]>("bizflow:automations", SEED_AUTOMATIONS);
  const [formOpen, setFormOpen] = useState(false);

  function toggleStatus(id: string, currentStatus: string) {
    const nextStatus = currentStatus === "active" ? "paused" : "active";
    setAutomations(automations.map(a => a.id === id ? { ...a, status: nextStatus } : a));
    toast.success(`Automation ${nextStatus}`);
  }

  function deleteAutomation(id: string) {
    setAutomations(automations.filter(a => a.id !== id));
    toast.success("Automation deleted");
  }

  function handleCreate(a: Automation) {
    setAutomations([a, ...automations]);
    toast.success("Automation created");
  }

  const activeCount = automations.filter(a => a.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl flex items-center gap-2">
            <Zap className="h-6 w-6 text-accent" />
            Automations
          </h1>
          <p className="mt-1 text-sm text-muted">
            Create rules to automate routine tasks.{" "}
            <span className="text-xs">Demo — rules are simulated and do not execute real actions.</span>
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus /> New Automation
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
              <PlayCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted">Active Rules</p>
              <p className="tabular font-heading text-2xl font-semibold">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning/15 text-warning">
              <PauseCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted">Paused Rules</p>
              <p className="tabular font-heading text-2xl font-semibold">{automations.length - activeCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {automations.map(a => (
          <Card key={a.id} className={a.status === "paused" ? "opacity-70" : ""}>
            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${a.status === "active" ? "bg-accent/10 text-accent" : "bg-surface text-muted"}`}>
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground flex items-center gap-2">
                    {a.name}
                    <Badge variant={a.status === "active" ? "success" : "muted"}>{a.status}</Badge>
                  </p>
                  <p className="text-sm text-muted mt-1">{TRIGGER_LABELS[a.trigger]}</p>
                  <p className="text-[10px] text-muted/70 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last run: {a.lastRun ? formatDate(a.lastRun, "en-US", { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Never"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 self-end sm:self-auto">
                <Switch
                  checked={a.status === "active"}
                  onCheckedChange={() => toggleStatus(a.id, a.status)}
                  aria-label={`Toggle ${a.name}`}
                />
                <Button variant="ghost" size="icon" onClick={() => deleteAutomation(a.id)} className="text-muted hover:text-danger">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AutomationForm open={formOpen} onOpenChange={setFormOpen} onSubmit={handleCreate} />
    </div>
  );
}