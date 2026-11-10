"use client";

import { useState } from "react";
import { Plus, Warehouse as WarehouseIcon, Box } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Warehouse, Branch } from "@/types/operations";
import { WarehouseTable } from "./warehouse-table";
import { WarehouseForm } from "./warehouse-form";
import { createWarehouse } from "@/actions/operations";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export function WarehousesClient({ initialWarehouses, initialBranches }: { initialWarehouses: Warehouse[]; initialBranches: Branch[] }) {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses);
  const [branches] = useState<Branch[]>(initialBranches);
  const router = useRouter();
  
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Warehouse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Warehouse | null>(null);

  const total = warehouses.length;
  const active = warehouses.filter(w => w.status === "active").length;
  const totalCapacity = warehouses.reduce((s, w) => s + w.capacity, 0);
  
  const cards = [
    { label: "Total Warehouses", value: total, icon: WarehouseIcon },
    { label: "Active Facilities", value: active, icon: WarehouseIcon },
    { label: "Total Capacity", value: totalCapacity.toLocaleString(), icon: Box },
  ];

  function openAdd() { setEditing(null); setFormOpen(true); }
  function openEdit(w: Warehouse) { setEditing(w); setFormOpen(true); }

  async function submit(input: Warehouse) {
    if (input.id) {
      toast.error("Editing coming soon");
      return;
    }
    const res = await createWarehouse(input);
    if (res.error) return toast.error(res.error);

    setWarehouses([input, ...warehouses]);
    toast.success("Warehouse saved to database");
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
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">Warehouses</h1>
          <p className="mt-1 text-sm text-muted">
            Manage storage facilities and capacity.{" "}
            <span className="text-xs text-success">Connected to PostgreSQL.</span>
          </p>
        </div>
        <Button onClick={openAdd}><Plus /> Add Warehouse</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
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

      <WarehouseTable warehouses={warehouses} branches={branches} onEdit={openEdit} onDelete={setDeleteTarget} />

      <WarehouseForm open={formOpen} onOpenChange={(o) => { setFormOpen(o); if (!o) setEditing(null); }} warehouse={editing} branches={branches} onSubmit={submit} />

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