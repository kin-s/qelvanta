"use client";

import { useState } from "react";
import { Plus, Building2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import { SEED_BRANCHES, SEED_WAREHOUSES } from "@/data/operations";
import type { Branch, Warehouse } from "@/types/operations";
import { BranchTable } from "./branch-table";
import { BranchForm } from "./branch-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export function BranchesClient() {
  const [branches, setBranches] = useLocalStorageState<Branch[]>("bizflow:branches", SEED_BRANCHES);
  const [warehouses] = useLocalStorageState<Warehouse[]>("bizflow:warehouses", SEED_WAREHOUSES);
  
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Branch | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null);

  const total = branches.length;
  const active = branches.filter(b => b.status === "active").length;
  
  const uniqueCities = new Set(branches.map(b => b.city)).size;
  const totalWarehouses = warehouses.length;

  const cards = [
    { label: "Total Branches", value: total, icon: Building2 },
    { label: "Active Branches", value: active, icon: Building2 },
    { label: "Cities Covered", value: uniqueCities, icon: MapPin },
    { label: "Total Warehouses", value: totalWarehouses, icon: MapPin },
  ];

  function openAdd() { setEditing(null); setFormOpen(true); }
  function openEdit(b: Branch) { setEditing(b); setFormOpen(true); }

  function submit(input: Branch) {
    const branch = input.id ? input : { ...input, id: `br_${crypto.randomUUID().slice(0, 8)}` };
    const exists = branches.some(b => b.id === branch.id);
    if (exists) {
      setBranches(branches.map(b => b.id === branch.id ? branch : b));
      toast.success("Branch updated");
    } else {
      setBranches([branch, ...branches]);
      toast.success("Branch added");
    }
    setFormOpen(false);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const hasWarehouses = warehouses.some(w => w.branchId === deleteTarget.id);
    if (hasWarehouses) {
      toast.error("Cannot delete", { description: "This branch has warehouses assigned to it. Move or delete them first." });
      setDeleteTarget(null);
      return;
    }
    setBranches(branches.filter(b => b.id !== deleteTarget.id));
    toast.success("Branch deleted");
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">Branches</h1>
          <p className="mt-1 text-sm text-muted">Manage physical locations and regional hubs.</p>
        </div>
        <Button onClick={openAdd}><Plus /> Add Branch</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-5 flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">{c.label}</p>
                <p className="tabular mt-2 font-heading text-2xl font-semibold">{c.value}</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                <c.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <BranchTable branches={branches} onEdit={openEdit} onDelete={setDeleteTarget} />

      <BranchForm open={formOpen} onOpenChange={(o) => { setFormOpen(o); if (!o) setEditing(null); }} branch={editing} onSubmit={submit} />

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>This will remove the branch. You cannot undo this.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}