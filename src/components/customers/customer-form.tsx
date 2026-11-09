"use client";

import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { COUNTRIES } from "@/data/customers";
import {
  SEGMENT_LABELS,
  type Customer,
  type CustomerSegment,
  type CustomerType,
} from "@/types/customers";

const schema = z.object({
  name: z.string().min(2, "Enter a customer name"),
  email: z
    .string()
    .email("Enter a valid email")
    .or(z.literal(""))
    .optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  type: z.enum(["individual", "business"]),
  segment: z.enum(["new", "regular", "vip", "wholesale", "corporate", "inactive"]),
  status: z.enum(["active", "inactive"]),
  creditLimit: z.coerce.number().min(0, "Must be ≥ 0"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const EMPTY: FormValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  country: "",
  city: "",
  address: "",
  type: "individual",
  segment: "new",
  status: "active",
  creditLimit: 0,
  notes: "",
};

export function CustomerForm({
  open,
  onOpenChange,
  customer,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onSubmit: (c: Customer) => void;
}) {
  const isEdit = !!customer;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (open) {
      reset(
        customer
          ? {
              name: customer.name,
              email: customer.email,
              phone: customer.phone,
              company: customer.company,
              country: customer.country,
              city: customer.city,
              address: customer.address,
              type: customer.type,
              segment: customer.segment,
              status: customer.status,
              creditLimit: customer.creditLimit,
              notes: customer.notes,
            }
          : EMPTY
      );
    }
  }, [open, customer, reset]);

  function submit(values: FormValues) {
    const now = new Date().toISOString();
    const next: Customer = {
      id: customer?.id ?? "",
      name: values.name,
      email: values.email ?? "",
      phone: values.phone ?? "",
      company: values.company ?? "",
      country: values.country ?? "",
      city: values.city ?? "",
      address: values.address ?? "",
      type: values.type as CustomerType,
      segment: values.segment as CustomerSegment,
      status: values.status,
      creditLimit: values.creditLimit,
      notes: values.notes ?? "",
      createdAt: customer?.createdAt ?? now,
      updatedAt: now,
    };
    onSubmit(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit customer" : "Add customer"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the customer details. Changes apply immediately in this demo."
              : "Add a new customer to your CRM. You can edit it later."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Full name *</Label>
              <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
              {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
              {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" {...register("phone")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select id="type" {...register("type")}>
                <option value="individual">Individual</option>
                <option value="business">Business</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" {...register("company")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select id="country" {...register("country")}>
                <option value="">Select…</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register("address")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="segment">Segment</Label>
              <Select id="segment" {...register("segment")}>
                {(Object.keys(SEGMENT_LABELS) as CustomerSegment[]).map((s) => (
                  <option key={s} value={s}>{SEGMENT_LABELS[s]}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" {...register("status")}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditLimit">Credit limit</Label>
              <Input id="creditLimit" type="number" step="0.01" {...register("creditLimit")} aria-invalid={!!errors.creditLimit} />
              {errors.creditLimit && <p className="text-xs text-danger">{errors.creditLimit.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" rows={3} {...register("notes")} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Add customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}