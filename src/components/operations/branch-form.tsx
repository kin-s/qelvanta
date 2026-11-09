"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { COUNTRIES, type Branch } from "@/types/operations";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  code: z.string().min(2, "Code required"),
  address: z.string().min(5, "Address required"),
  city: z.string().min(2, "City required"),
  country: z.string().min(1, "Country required"),
  manager: z.string().min(2, "Manager name required"),
  phone: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

type FormValues = z.infer<typeof schema>;

export function BranchForm({
  open, onOpenChange, branch, onSubmit
}: {
  open: boolean; onOpenChange: (open: boolean) => void; branch: Branch | null; onSubmit: (b: Branch) => void;
}) {
  const isEdit = !!branch;
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      name: "", code: "", address: "", city: "", country: "United States", manager: "", phone: "", status: "active",
    },
  });

  function handleOpenChange(next: boolean) {
    if (next) {
      reset(branch ? {
        name: branch.name, code: branch.code, address: branch.address, city: branch.city,
        country: branch.country, manager: branch.manager, phone: branch.phone, status: branch.status,
      } : {
        name: "", code: "", address: "", city: "", country: "United States", manager: "", phone: "", status: "active",
      });
    }
    onOpenChange(next);
  }

  function submit(values: FormValues) {
    onSubmit({
      id: branch?.id ?? `br_${crypto.randomUUID().slice(0, 8)}`,
      name: values.name,
      code: values.code.toUpperCase(),
      address: values.address,
      city: values.city,
      country: values.country,
      manager: values.manager,
      phone: values.phone ?? "",
      status: values.status,
      createdAt: branch?.createdAt ?? new Date().toISOString(),
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Branch" : "Add Branch"}</DialogTitle>
          <DialogDescription>Define a physical business location.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2 col-span-2">
              <Label>Branch Name *</Label>
              <Input {...register("name")} aria-invalid={!!errors.name} placeholder="e.g. Westlands Branch" />
              {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Branch Code *</Label>
              <Input {...register("code")} aria-invalid={!!errors.code} placeholder="e.g. WL-03" />
              {errors.code && <p className="text-xs text-danger">{errors.code.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Manager *</Label>
              <Input {...register("manager")} aria-invalid={!!errors.manager} />
              {errors.manager && <p className="text-xs text-danger">{errors.manager.message}</p>}
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Address *</Label>
              <Input {...register("address")} aria-invalid={!!errors.address} />
              {errors.address && <p className="text-xs text-danger">{errors.address.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>City *</Label>
              <Input {...register("city")} aria-invalid={!!errors.city} />
            </div>
            <div className="space-y-2">
              <Label>Country *</Label>
              <Select {...register("country")}>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input type="tel" {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select {...register("status")}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{isEdit ? "Save Changes" : "Add Branch"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}