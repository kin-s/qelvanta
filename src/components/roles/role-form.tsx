"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PERMISSION_MATRIX, type Role } from "@/types/users";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Role name required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function RoleForm({
  open, onOpenChange, role, onSubmit
}: {
  open: boolean; onOpenChange: (open: boolean) => void; role: Role | null; onSubmit: (r: Role) => void;
}) {
  const isEdit = !!role;
  const [permissions, setPermissions] = useState<string[]>([]);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
  });

  function handleOpenChange(next: boolean) {
    if (next) {
      reset(role ? { name: role.name, description: role.description } : { name: "", description: "" });
      setPermissions(role?.permissions ?? ["dashboard:read"]);
    }
    onOpenChange(next);
  }

  function togglePermission(id: string) {
    setPermissions(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  }

  function toggleGroup(groupIndex: number) {
    const group = PERMISSION_MATRIX[groupIndex];
    const groupIds = group.permissions.map(p => p.id);
    const allSelected = groupIds.every(id => permissions.includes(id));
    
    if (allSelected) {
      setPermissions(prev => prev.filter(p => !groupIds.includes(p)));
    } else {
      const newPerms = new Set([...permissions, ...groupIds]);
      setPermissions(Array.from(newPerms));
    }
  }

  function submit(values: FormValues) {
    onSubmit({
      id: role?.id ?? `role_${crypto.randomUUID().slice(0, 8)}`,
      name: values.name,
      description: values.description || "",
      permissions,
      isSystem: role?.isSystem ?? false,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Role" : "Create Custom Role"}</DialogTitle>
          <DialogDescription>Configure permissions for this role.</DialogDescription>
        </DialogHeader>
        
        {role?.isSystem && (
          <div className="rounded-md bg-warning/10 p-3 text-xs text-warning border border-warning/20 mb-2">
            This is a system role. You cannot rename it, but you can adjust its permissions.
          </div>
        )}

        <form onSubmit={handleSubmit(submit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Role Name *</Label>
              <Input {...register("name")} aria-invalid={!!errors.name} disabled={role?.isSystem} />
              {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea {...register("description")} rows={2} disabled={role?.isSystem} />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base">Permissions</Label>
            <div className="grid gap-4 sm:grid-cols-2">
              {PERMISSION_MATRIX.map((group, idx) => {
                const groupIds = group.permissions.map(p => p.id);
                const allSelected = groupIds.every(id => permissions.includes(id));
                
                return (
                  <div key={group.label} className="rounded-lg border border-border bg-surface/30 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted">{group.label}</span>
                      <button
                        type="button"
                        onClick={() => toggleGroup(idx)}
                        className="text-[10px] text-accent hover:underline"
                      >
                        {allSelected ? "Clear all" : "Select all"}
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {group.permissions.map(p => {
                        const active = permissions.includes(p.id);
                        return (
                          <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={active}
                              onChange={() => togglePermission(p.id)}
                              className="h-4 w-4 rounded border-border accent-accent"
                            />
                            <span className={cn("text-sm", active ? "text-foreground" : "text-muted")}>
                              {p.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{isEdit ? "Save Role" : "Create Role"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}