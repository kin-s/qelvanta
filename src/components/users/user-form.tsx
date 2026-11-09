"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { User, Role } from "@/types/users";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  roleId: z.string().min(1, "Role required"),
});

type FormValues = z.infer<typeof schema>;

export function UserForm({
  open, onOpenChange, roles, onSubmit
}: {
  open: boolean; onOpenChange: (open: boolean) => void; roles: Role[]; onSubmit: (u: User) => void;
}) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { name: "", email: "", roleId: roles[0]?.id || "" },
  });

  function handleOpenChange(next: boolean) {
    if (next) reset({ name: "", email: "", roleId: roles[0]?.id || "" });
    onOpenChange(next);
  }

  function submit(values: FormValues) {
    onSubmit({
      id: `usr_${crypto.randomUUID().slice(0, 8)}`,
      name: values.name,
      email: values.email,
      roleId: values.roleId,
      status: "invited",
      createdAt: new Date().toISOString(),
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>Send an invitation to join your workspace.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name *</Label>
            <Input {...register("name")} aria-invalid={!!errors.name} placeholder="e.g. Jane Doe" />
            {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Email Address *</Label>
            <Input type="email" {...register("email")} aria-invalid={!!errors.email} placeholder="jane@company.com" />
            {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Assign Role *</Label>
            <Select {...register("roleId")}>
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Send Invite</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}