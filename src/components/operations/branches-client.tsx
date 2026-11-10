"use client";

import { useState } from "react";
import { Plus, Building2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Branch, Warehouse } from "@/types/operations";
import { BranchTable } from "./branch-table";
import { BranchForm } from "./branch-form";
import { createBranch } from "@/actions/operations";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export function BranchesClient({ initialBranches, initialWarehouses }: { initialBranches: Branch[]; initialWarehouses: Warehouse[] }) {
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [warehouses] = useState<Warehouse[]>(initialWarehouses);
  const router = useRouter();
  
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

  async function submit(input: Branch) {
    if (input.id) {
      toast.error("Editing coming soon");
      return;
    }
    const res = await createBranch(input);
    if (res.error) return toast.error(res.error);

    setBranches([input, ...branches]);
    toast.success("Branch saved to database");
    setFormOpen(false);
    router.refresh();
  }

  function confirmDelete() {
    toast.error("Deletion coming soon");
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">Branches</h1>
          <p className="mt-1 text-sm text-muted">
            Manage physical locations.{" "}
            <span className="text-xs text-success">Connected to PostgreSQL.</span>
          </p>
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
            <AlertDialogDescription>This action is coming soon.</AlertDialogDescription>
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