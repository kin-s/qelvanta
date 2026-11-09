"use client";

import { useState } from "react";
import { useForm, useFieldArray, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import { SEED_CUSTOMERS_FULL } from "@/data/customers";
import type { BusinessDocument, DocumentType, Invoice, Quotation, LineItem } from "@/types/invoices";

const schema = z.object({
  customerId: z.string().min(1, "Select a customer"),
  issueDate: z.string().min(1, "Issue date required"),
  dueDate: z.string().min(1, "Due date required"),
  items: z.array(z.object({
    id: z.string(),
    description: z.string().min(1, "Description required"),
    quantity: z.coerce.number().min(1, "Min 1"),
    unitPrice: z.coerce.number().min(0, "Min 0"),
  })).min(1, "Add at least one item"),
  discountPct: z.coerce.number().min(0).max(100),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// ==========================================
// INNER FORM (Only mounts on the client)
// ==========================================
function InvoiceFormInner({
  type,
  onOpenChange,
  onSubmit,
}: {
  type: DocumentType;
  onOpenChange: (open: boolean) => void;
  onSubmit: (doc: BusinessDocument) => void;
}) {
  const [error, setError] = useState("");
  
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: (() => {
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return {
        customerId: "",
        issueDate: today.toISOString().slice(0, 10),
        dueDate: nextMonth.toISOString().slice(0, 10),
        items: [{ id: `li_${crypto.randomUUID().slice(0, 6)}`, description: "", quantity: 1, unitPrice: 0 }],
        discountPct: 0,
        notes: "",
      };
    })(),
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const watchItems = useWatch({ control, name: "items" }) || [];
  const watchDiscount = useWatch({ control, name: "discountPct" }) || 0;

  const subtotal = watchItems.reduce((s, i) => s + (i.quantity * i.unitPrice || 0), 0);
  const discountAmount = subtotal * (watchDiscount / 100);
  const taxable = subtotal - discountAmount;
  const taxRate = 0.1;
  const taxAmount = taxable * taxRate;
  const total = taxable + taxAmount;

  function submit(values: FormValues) {
    const customer = SEED_CUSTOMERS_FULL.find(c => c.id === values.customerId);
    if (!customer) { setError("Customer not found"); return; }

    const items: LineItem[] = values.items.map((i) => ({
      id: i.id,
      description: i.description,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      amount: i.quantity * i.unitPrice,
    }));

    const prefix = type === "invoice" ? "INV" : "QT";
    const docBase = {
      id: `${prefix}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      issueDate: new Date(values.issueDate).toISOString(),
      items,
      subtotal,
      taxRate,
      taxAmount,
      discountPct: values.discountPct,
      discountAmount,
      total,
      notes: values.notes || "",
      createdAt: new Date().toISOString(),
    };

    if (type === "invoice") {
      onSubmit({ ...docBase, type: "invoice", dueDate: new Date(values.dueDate).toISOString(), status: "draft" } as Invoice);
    } else {
      onSubmit({ ...docBase, type: "quotation", expiryDate: new Date(values.dueDate).toISOString(), status: "draft" } as Quotation);
    }
    onOpenChange(false);
  }

  const isInvoice = type === "invoice";

  return (
    <>
      <DialogHeader>
        <DialogTitle>Create {isInvoice ? "Invoice" : "Quotation"}</DialogTitle>
        <DialogDescription>Add line items and terms.</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2 sm:col-span-1">
            <Label>Customer *</Label>
            <Select {...register("customerId")} aria-invalid={!!errors.customerId}>
              <option value="">Select…</option>
              {SEED_CUSTOMERS_FULL.filter(c => c.id !== "cust_walkin").map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
            {errors.customerId && <p className="text-xs text-danger">{errors.customerId.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Issue Date *</Label>
            <Input type="date" {...register("issueDate")} />
          </div>
          <div className="space-y-2">
            <Label>{isInvoice ? "Due Date" : "Expiry Date"} *</Label>
            <Input type="date" {...register("dueDate")} />
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Line Items *</Label>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-wrap items-start gap-2 sm:flex-nowrap">
                <div className="w-full flex-1">
                  <Input {...register(`items.${index}.description`)} placeholder="Description" />
                  {errors.items?.[index]?.description && <p className="text-[10px] text-danger mt-1">{errors.items[index]?.description?.message}</p>}
                </div>
                <div className="w-20">
                  <Input type="number" {...register(`items.${index}.quantity`)} placeholder="Qty" />
                </div>
                <div className="w-24">
                  <Input type="number" step="0.01" {...register(`items.${index}.unitPrice`)} placeholder="Price" />
                </div>
                <div className="flex h-10 w-24 items-center justify-end px-2 text-sm font-medium tabular">
                  {formatCurrency((watchItems[index]?.quantity || 0) * (watchItems[index]?.unitPrice || 0))}
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length === 1} aria-label="Remove line">
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="secondary" size="sm" className="mt-2" onClick={() => append({ id: `li_${crypto.randomUUID().slice(0, 6)}`, description: "", quantity: 1, unitPrice: 0 })}>
            <Plus /> Add Line Item
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Notes / Terms</Label>
            <Textarea {...register("notes")} rows={3} placeholder="Payment instructions..." />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Discount (%)</Label>
              <Input type="number" className="w-20 text-right" {...register("discountPct")} />
            </div>
            <Separator />
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="tabular">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-muted">
                  <span>Discount</span>
                  <span className="tabular">−{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <span>Tax (10%)</span>
                <span className="tabular">{formatCurrency(taxAmount)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-heading text-lg font-semibold">
                <span>Total</span>
                <span className="tabular">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit">Save as Draft</Button>
        </DialogFooter>
      </form>
    </>
  );
}

// ==========================================
// WRAPPER (Safe for prerendering)
// ==========================================
export function InvoiceForm({
  open, onOpenChange, type, onSubmit
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: DocumentType;
  onSubmit: (doc: BusinessDocument) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        {open && (
          <InvoiceFormInner
            type={type}
            onOpenChange={onOpenChange}
            onSubmit={onSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}