"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import { SEED_USERS, SEED_ROLES } from "@/data/users";
import type { User } from "@/types/users";
import { UserTable } from "./user-table";
import { UserForm } from "./user-form";

export function UsersSettings() {
  const [users, setUsers] = useLocalStorageState<User[]>("bizflow:users", SEED_USERS);
  const [roles] = useLocalStorageState("bizflow:roles", SEED_ROLES);
  
  const [formOpen, setFormOpen] = useState(false);

  function handleInvite(u: User) {
    setUsers([u, ...users]);
    toast.success("Invitation sent", { description: u.email });
  }

  function updateRole(userId: string, roleId: string) {
    setUsers(users.map(u => u.id === userId ? { ...u, roleId } : u));
    toast.success("Role updated");
  }

  function removeUser(userId: string) {
    const user = users.find(u => u.id === userId);
    if (user?.roleId === "role_owner") {
      toast.error("Cannot remove the workspace owner.");
      return;
    }
    setUsers(users.filter(u => u.id !== userId));
    toast.success("User removed");
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-heading text-lg font-semibold">Team Members</h2>
          <p className="text-sm text-muted">Manage who has access to your workspace.</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus /> Invite User
        </Button>
      </div>

      <UserTable 
        users={users} 
        roles={roles} 
        onUpdateRole={updateRole} 
        onRemove={removeUser} 
      />

      <UserForm 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        roles={roles} 
        onSubmit={handleInvite} 
      />
    </div>
  );
}