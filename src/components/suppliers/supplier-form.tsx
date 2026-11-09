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
import { SUPPLIER_COUNTRIES, PAYMENT_TERMS } from "@/data/suppliers";
import type { Supplier } from "@/types/suppliers";

const schema = z.object({
  name: z.string().min(2, "Enter a supplier name"),
  contactName: z.string().optional(),
  email: z.string().email("Enter a valid email").or(z.literal("")).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  taxId: z.string().optional(),
  paymentTerms: z.string(),
  status: z.enum(["active", "inactive"]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const EMPTY: FormValues = {
  name: "",
  contactName: "",
  email: "",
  phone: "",
  address: "",
  country: "",
  city: "",
  taxId: "",
  paymentTerms: "Net 30",
  status: "active",
  notes: "",
};

export function SupplierForm({
  open,
  onOpenChange,
  supplier,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
  onSubmit: (s: Supplier) => void;
}) {
  const isEdit = !!supplier;
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
        supplier
          ? {
              name: supplier.name,
              contactName: supplier.contactName,
              email: supplier.email,
              phone: supplier.phone,
              address: supplier.address,
              country: supplier.country,
              city: supplier.city,
              taxId: supplier.taxId,
              paymentTerms: supplier.paymentTerms,
              status: supplier.status,
              notes: supplier.notes,
            }
          : EMPTY
      );
    }
  }, [open, supplier, reset]);

  function submit(values: FormValues) {
    const now = new Date().toISOString();
    const next: Supplier = {
      id: supplier?.id ?? "",
      name: values.name,
      contactName: values.contactName ?? "",
      email: values.email ?? "",
      phone: values.phone ?? "",
      address: values.address ?? "",
      country: values.country ?? "",
      city: values.city ?? "",
      taxId: values.taxId ?? "",
      paymentTerms: values.paymentTerms,
      status: values.status,
      notes: values.notes ?? "",
      createdAt: supplier?.createdAt ?? now,
      updatedAt: now,
    };
    onSubmit(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit supplier" : "Add supplier"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the supplier details."
              : "Add a new supplier to your directory."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Supplier name *</Label>
              <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
              {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactName">Contact person</Label>
              <Input id="contactName" {...register("contactName")} />
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
              <Label htmlFor="taxId">Tax ID</Label>
              <Input id="taxId" {...register("taxId")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select id="country" {...register("country")}>
                <option value="">Select…</option>
                {SUPPLIER_COUNTRIES.map((c) => (
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
              <Label htmlFor="paymentTerms">Payment terms</Label>
              <Select id="paymentTerms" {...register("paymentTerms")}>
                {PAYMENT_TERMS.map((t) => (
                  <option key={t} value={t}>{t}</option>
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
              {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Add supplier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}