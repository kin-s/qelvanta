"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TRIGGER_LABELS, type Automation, type AutomationTrigger } from "@/types/automations";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  trigger: z.enum(["stock_low", "invoice_overdue", "daily_summary", "expense_large", "shift_reminder", "monthly_report"]),
});

type FormValues = z.infer<typeof schema>;

export function AutomationForm({
  open, onOpenChange, onSubmit
}: {
  open: boolean; onOpenChange: (open: boolean) => void; onSubmit: (a: Automation) => void;
}) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { name: "", trigger: "stock_low" },
  });

  function handleOpenChange(next: boolean) {
    if (next) reset({ name: "", trigger: "stock_low" });
    onOpenChange(next);
  }

  function submit(values: FormValues) {
    onSubmit({
      id: `auto_${crypto.randomUUID().slice(0, 8)}`,
      name: values.name,
      trigger: values.trigger as AutomationTrigger,
      status: "active",
      lastRun: null,
      createdAt: new Date().toISOString(),
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Automation</DialogTitle>
          <DialogDescription>Set up a new workflow rule.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label>Automation Name *</Label>
            <Input {...register("name")} aria-invalid={!!errors.name} placeholder="e.g. Low Stock Alert" />
            {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Trigger Event *</Label>
            <Select {...register("trigger")}>
              {(Object.keys(TRIGGER_LABELS) as AutomationTrigger[]).map(t => (
                <option key={t} value={t}>{TRIGGER_LABELS[t]}</option>
              ))}
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Create Automation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}