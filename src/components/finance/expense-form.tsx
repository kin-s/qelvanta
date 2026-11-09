"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { EXPENSE_CATEGORY_LABELS, PAYMENT_METHOD_LABELS, type Expense, type ExpenseCategory, type PaymentMethod } from "@/types/finance";

const schema = z.object({
  title: z.string().min(2, "Title required"),
  category: z.enum(["rent", "utilities", "salaries", "transport", "marketing", "supplies", "maintenance", "insurance", "taxes", "other"]),
  amount: z.coerce.number().min(0.01, "Amount must be > 0"),
  date: z.string().min(1, "Date required"),
  paymentMethod: z.enum(["cash", "card", "bank_transfer", "digital_wallet"]),
  supplier: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["paid", "pending"]),
});

type FormValues = z.infer<typeof schema>;

export function ExpenseForm({
  open, onOpenChange, onSubmit
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: Expense) => void;
}) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      title: "", category: "other", amount: 0, date: "",
      paymentMethod: "card", supplier: "", description: "", status: "paid",
    },
  });

  function handleOpenChange(next: boolean) {
    if (next) reset({
      title: "", category: "other", amount: 0, date: new Date().toISOString().slice(0, 10),
      paymentMethod: "card", supplier: "", description: "", status: "paid",
    });
    onOpenChange(next);
  }

  function submit(values: FormValues) {
    const now = new Date().toISOString();
    onSubmit({
      id: `exp_${crypto.randomUUID().slice(0, 8)}`,
      title: values.title,
      category: values.category as ExpenseCategory,
      amount: values.amount,
      currency: "USD",
      date: new Date(values.date).toISOString(),
      paymentMethod: values.paymentMethod as PaymentMethod,
      supplier: values.supplier ?? "",
      description: values.description ?? "",
      branch: "Main",
      status: values.status,
      createdAt: now,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record expense</DialogTitle>
          <DialogDescription>Add a new business expense.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input {...register("title")} aria-invalid={!!errors.title} placeholder="e.g. Office rent" />
            {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Amount *</Label>
              <Input type="number" step="0.01" {...register("amount")} aria-invalid={!!errors.amount} />
              {errors.amount && <p className="text-xs text-danger">{errors.amount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Date *</Label>
              <Input type="date" {...register("date")} aria-invalid={!!errors.date} />
              {errors.date && <p className="text-xs text-danger">{errors.date.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select {...register("category")}>
                {(Object.keys(EXPENSE_CATEGORY_LABELS) as ExpenseCategory[]).map(c => (
                  <option key={c} value={c}>{EXPENSE_CATEGORY_LABELS[c]}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Payment method</Label>
              <Select {...register("paymentMethod")}>
                {(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map(m => (
                  <option key={m} value={m}>{PAYMENT_METHOD_LABELS[m]}</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Supplier / Payee</Label>
              <Input {...register("supplier")} placeholder="Optional" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select {...register("status")}>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...register("description")} rows={2} placeholder="Optional details..." />
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save expense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}