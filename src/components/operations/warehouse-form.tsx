"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type Warehouse, type Branch } from "@/types/operations";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  code: z.string().min(2, "Code required"),
  branchId: z.string().min(1, "Branch required"),
  address: z.string().min(5, "Address required"),
  manager: z.string().min(2, "Manager name required"),
  capacity: z.coerce.number().min(1, "Capacity must be > 0"),
  status: z.enum(["active", "inactive"]),
});

type FormValues = z.infer<typeof schema>;

export function WarehouseForm({
  open, onOpenChange, warehouse, branches, onSubmit
}: {
  open: boolean; onOpenChange: (open: boolean) => void; warehouse: Warehouse | null; branches: Branch[]; onSubmit: (w: Warehouse) => void;
}) {
  const isEdit = !!warehouse;
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      name: "", code: "", branchId: "", address: "", manager: "", capacity: 1000, status: "active",
    },
  });

  function handleOpenChange(next: boolean) {
    if (next) {
      reset(warehouse ? {
        name: warehouse.name, code: warehouse.code, branchId: warehouse.branchId, address: warehouse.address,
        manager: warehouse.manager, capacity: warehouse.capacity, status: warehouse.status,
      } : {
        name: "", code: "", branchId: branches[0]?.id ?? "", address: "", manager: "", capacity: 1000, status: "active",
      });
    }
    onOpenChange(next);
  }

  function submit(values: FormValues) {
    onSubmit({
      id: warehouse?.id ?? `wh_${crypto.randomUUID().slice(0, 8)}`,
      name: values.name,
      code: values.code.toUpperCase(),
      branchId: values.branchId,
      address: values.address,
      manager: values.manager,
      capacity: values.capacity,
      status: values.status,
      createdAt: warehouse?.createdAt ?? new Date().toISOString(),
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Warehouse" : "Add Warehouse"}</DialogTitle>
          <DialogDescription>Define a storage facility linked to a branch.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2 col-span-2">
              <Label>Warehouse Name *</Label>
              <Input {...register("name")} aria-invalid={!!errors.name} placeholder="e.g. Main Warehouse" />
              {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Code *</Label>
              <Input {...register("code")} aria-invalid={!!errors.code} placeholder="e.g. WH-MAIN" />
              {errors.code && <p className="text-xs text-danger">{errors.code.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Assigned Branch *</Label>
              <Select {...register("branchId")}>
                {branches.filter(b => b.status === "active").map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Address *</Label>
              <Input {...register("address")} aria-invalid={!!errors.address} />
              {errors.address && <p className="text-xs text-danger">{errors.address.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Manager *</Label>
              <Input {...register("manager")} aria-invalid={!!errors.manager} />
              {errors.manager && <p className="text-xs text-danger">{errors.manager.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Max Capacity (Units) *</Label>
              <Input type="number" {...register("capacity")} aria-invalid={!!errors.capacity} />
              {errors.capacity && <p className="text-xs text-danger">{errors.capacity.message}</p>}
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Status</Label>
              <Select {...register("status")}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{isEdit ? "Save Changes" : "Add Warehouse"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}