"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import { SEED_INVOICES, SEED_QUOTATIONS } from "@/data/invoices";
import type { Invoice, Quotation, BusinessDocument } from "@/types/invoices";
import { InvoiceTable } from "./invoice-table";
import { InvoiceForm } from "./invoice-form";
import { InvoiceDetailSheet } from "./invoice-detail-sheet";
import { cn } from "@/lib/utils";

type Tab = "invoices" | "quotations";

export function InvoicesClient() {
  const [invoices, setInvoices] = useLocalStorageState<Invoice[]>("bizflow:invoices", SEED_INVOICES);
  const [quotations, setQuotations] = useLocalStorageState<Quotation[]>("bizflow:quotations", SEED_QUOTATIONS);

  const [tab, setTab] = useState<Tab>("invoices");
  const [formOpen, setFormOpen] = useState(false);
  const [viewingId, setViewingId] = useState<string | null>(null);

  const viewingDoc = viewingId
    ? tab === "invoices"
      ? invoices.find(i => i.id === viewingId) ?? null
      : quotations.find(q => q.id === viewingId) ?? null
    : null;

  function handleCreate(doc: BusinessDocument) {
    if (doc.type === "invoice") {
      setInvoices([doc, ...invoices]);
      toast.success("Invoice created", { description: doc.id });
    } else {
      setQuotations([doc, ...quotations]);
      toast.success("Quotation created", { description: doc.id });
    }
    setViewingId(doc.id);
  }

  function handleDelete(id: string) {
    if (tab === "invoices") setInvoices(invoices.filter(i => i.id !== id));
    else setQuotations(quotations.filter(q => q.id !== id));
    toast.success("Deleted", { description: id });
    if (viewingId === id) setViewingId(null);
  }

  function handleStatusUpdate(id: string, status: string) {
    if (tab === "invoices") {
      setInvoices(invoices.map(i => i.id === id ? { ...i, status: status as Invoice["status"] } : i));
    } else {
      setQuotations(quotations.map(q => q.id === id ? { ...q, status: status as Quotation["status"] } : q));
    }
    toast.success(`Status updated to ${status}`);
  }

  function handleConvert(id: string) {
    const quote = quotations.find(q => q.id === id);
    if (!quote) return;

    const newInvoice: Invoice = {
      ...quote,
      type: "invoice",
      id: `INV-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "draft",
    };

    setInvoices([newInvoice, ...invoices]);
    setQuotations(quotations.map(q => q.id === id ? { ...q, status: "accepted" } : q));
    setTab("invoices");
    setViewingId(newInvoice.id);
    toast.success("Converted to Invoice", { description: newInvoice.id });
  }

  const tabs = [
    { id: "invoices" as const, label: "Invoices", count: invoices.length },
    { id: "quotations" as const, label: "Quotations", count: quotations.length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">Invoices & Quotations</h1>
          <p className="mt-1 text-sm text-muted">
            Create, send, and track your business documents.{" "}
            <span className="text-xs">Demo data — changes persist locally.</span>
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus /> Create {tab === "invoices" ? "Invoice" : "Quotation"}
        </Button>
      </div>

      <div role="tablist" className="flex gap-1 border-b border-border">
        {tabs.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              tab === t.id ? "border-accent text-foreground" : "border-transparent text-muted hover:text-foreground"
            )}
          >
            {t.label}
            <span className="ml-1.5 rounded-full bg-surface px-1.5 py-0.5 text-[10px] text-muted">{t.count}</span>
          </button>
        ))}
      </div>

      {tab === "invoices" && (
        <InvoiceTable docs={invoices} type="invoice" onView={(d) => setViewingId(d.id)} onDelete={handleDelete} />
      )}
      {tab === "quotations" && (
        <InvoiceTable docs={quotations} type="quotation" onView={(d) => setViewingId(d.id)} onDelete={handleDelete} />
      )}

      <InvoiceForm
        open={formOpen}
        onOpenChange={setFormOpen}
        type={tab === "invoices" ? "invoice" : "quotation"}
        onSubmit={handleCreate}
      />

      <InvoiceDetailSheet
        open={!!viewingId}
        onOpenChange={(o) => !o && setViewingId(null)}
        doc={viewingDoc}
        onUpdateStatus={handleStatusUpdate}
        onConvert={handleConvert}
      />
    </div>
  );
}