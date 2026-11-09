"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import { SEED_CUSTOMERS_FULL } from "@/data/customers";
import { SEED_SALES } from "@/data/sales";
import type { Customer } from "@/types/customers";
import type { Sale } from "@/types/sales";
import { CustomersOverview } from "./customers-overview";
import { CustomerTable } from "./customer-table";
import { CustomerForm } from "./customer-form";
import { CustomerDetailSheet } from "./customer-detail-sheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type Tab = "overview" | "catalog";

function generateId(): string {
  return `cust_${crypto.randomUUID().slice(0, 8)}`;
}

export function CustomersClient() {
  const [customers, setCustomers] = useLocalStorageState<Customer[]>(
    "bizflow:customers",
    SEED_CUSTOMERS_FULL
  );
  const [sales] = useLocalStorageState<Sale[]>("bizflow:sales", SEED_SALES);

  const [tab, setTab] = useState<Tab>("overview");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [viewing, setViewing] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "catalog", label: "Customers", count: customers.length },
  ];

  function openAdd() { setEditing(null); setFormOpen(true); }
  function openEdit(c: Customer) { setEditing(c); setFormOpen(true); setViewing(null); }

  function submit(input: Customer) {
    const customer = input.id ? input : { ...input, id: generateId() };
    const exists = customers.some((x) => x.id === customer.id);
    if (exists) {
      setCustomers(customers.map((x) => (x.id === customer.id ? customer : x)));
      toast.success("Customer updated");
    } else {
      setCustomers([...customers, customer]);
      toast.success("Customer added");
    }
    setFormOpen(false);
    setEditing(null);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setCustomers(customers.filter((c) => c.id !== deleteTarget.id));
    toast.success("Customer deleted", { description: deleteTarget.name });
    setDeleteTarget(null);
    setViewing(null);
  }

  const viewingFresh = viewing
    ? customers.find((c) => c.id === viewing.id) ?? null
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Customers
          </h1>
          <p className="mt-1 text-sm text-muted">
            Profiles, purchase history, and segments.{" "}
            <span className="text-xs">Demo data — changes persist locally.</span>
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus />
          Add customer
        </Button>
      </div>

      <div role="tablist" className="flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              tab === t.id
                ? "border-accent text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            )}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span className="ml-1.5 rounded-full bg-surface px-1.5 py-0.5 text-[10px] text-muted">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <CustomersOverview customers={customers} sales={sales} />
      )}

      {tab === "catalog" && (
        <CustomerTable
          customers={customers}
          sales={sales}
          onView={(c) => setViewing(c)}
          onEdit={openEdit}
          onDelete={(c) => setDeleteTarget(c)}
        />
      )}

      <CustomerForm
        open={formOpen}
        onOpenChange={(o) => { setFormOpen(o); if (!o) setEditing(null); }}
        customer={editing}
        onSubmit={submit}
      />

      <CustomerDetailSheet
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
        customer={viewingFresh}
        sales={sales}
        onEdit={openEdit}
        onDelete={(c) => { setViewing(null); setDeleteTarget(c); }}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete &ldquo;{deleteTarget?.name}&rdquo;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the customer record. Past sales tied
              to this customer are not affected. This action cannot be undone.
            </AlertDialogDescription>
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