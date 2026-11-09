"use client";

import { useState } from "react";
import { Plus, Shield, ShieldAlert, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import { SEED_ROLES } from "@/data/users";
import type { Role } from "@/types/users";
import { RoleForm } from "./role-form";

export function RolesSettings() {
  const [roles, setRoles] = useLocalStorageState<Role[]>("bizflow:roles", SEED_ROLES);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);

  function openAdd() { setEditing(null); setFormOpen(true); }
  function openEdit(r: Role) { setEditing(r); setFormOpen(true); }

  function handleSave(r: Role) {
    const exists = roles.some(x => x.id === r.id);
    if (exists) {
      setRoles(roles.map(x => x.id === r.id ? r : x));
      toast.success("Role updated");
    } else {
      setRoles([...roles, r]);
      toast.success("Custom role created");
    }
    setFormOpen(false);
  }

  function handleDelete(id: string) {
    // Note: In a real app, we'd check if any users are assigned to this role.
    setRoles(roles.filter(r => r.id !== id));
    toast.success("Role deleted");
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-heading text-lg font-semibold">Roles & Permissions</h2>
          <p className="text-sm text-muted">Define what different types of users can access.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus /> Create Custom Role
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {roles.map(role => (
          <Card key={role.id} className="relative flex flex-col">
            <CardContent className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-surface text-muted">
                    {role.isSystem ? <Shield className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{role.name}</p>
                    {role.isSystem && <Badge variant="muted" className="text-[10px] mt-0.5">System</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(role)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  {!role.isSystem && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted hover:text-danger" onClick={() => handleDelete(role.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted flex-1">{role.description}</p>
              
              <div className="mt-4 border-t border-border pt-3">
                <p className="text-[10px] uppercase tracking-wider text-muted mb-2">
                  {role.permissions.length} Permissions granted
                </p>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map(p => (
                    <Badge key={p} variant="outline" className="text-[9px] font-normal">{p}</Badge>
                  ))}
                  {role.permissions.length > 3 && (
                    <Badge variant="outline" className="text-[9px] font-normal">+{role.permissions.length - 3} more</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <RoleForm open={formOpen} onOpenChange={(o) => { setFormOpen(o); if (!o) setEditing(null); }} role={editing} onSubmit={handleSave} />
    </div>
  );
}