"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Invoice, Quotation, BusinessDocument } from "@/types/invoices";
import { InvoiceTable } from "./invoice-table";
import { InvoiceForm } from "./invoice-form";
import { InvoiceDetailSheet } from "./invoice-detail-sheet";
import { saveDocument } from "@/actions/invoices";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Tab = "invoices" | "quotations";

export function InvoicesClient({ initialInvoices, initialQuotations }: { initialInvoices: Invoice[]; initialQuotations: Quotation[] }) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [quotations, setQuotations] = useState<Quotation[]>(initialQuotations);
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("invoices");
  const [formOpen, setFormOpen] = useState(false);
  const [viewingId, setViewingId] = useState<string | null>(null);

  const viewingDoc = viewingId
    ? tab === "invoices"
      ? invoices.find(i => i.id === viewingId) ?? null
      : quotations.find(q => q.id === viewingId) ?? null
    : null;

  async function handleCreate(doc: BusinessDocument) {
    const res = await saveDocument(doc);
    if (res.error) return toast.error("Failed to save document");

    if (doc.type === "invoice") {
      setInvoices([doc as Invoice, ...invoices]);
    } else {
      setQuotations([doc as Quotation, ...quotations]);
    }
    toast.success(`${doc.type} saved to database`);
    setViewingId(doc.id);
    router.refresh();
  }

  function handleDelete() {
    toast.error("Deletion coming soon");
  }

  function handleStatusUpdate() {
    toast.error("Status updates coming soon");
  }

  function handleConvert() {
    toast.error("Conversion coming soon");
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
            Create, send, and track documents.{" "}
            <span className="text-xs text-success">Connected to PostgreSQL.</span>
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