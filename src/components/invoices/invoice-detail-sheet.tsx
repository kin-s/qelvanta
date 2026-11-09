"use client";

import { Printer, CheckCircle, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody, SheetFooter } from "@/components/ui/sheet";
import { DocumentPreview } from "./document-preview";
import { INVOICE_STATUS_LABELS, QUOTATION_STATUS_LABELS, STATUS_VARIANTS, type BusinessDocument } from "@/types/invoices";

export function InvoiceDetailSheet({
  open, onOpenChange, doc, onUpdateStatus, onConvert
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doc: BusinessDocument | null;
  onUpdateStatus: (id: string, status: string) => void;
  onConvert: (id: string) => void;
}) {
  if (!doc) {
    return <Sheet open={open} onOpenChange={onOpenChange}><SheetContent /></Sheet>;
  }

  const isInvoice = doc.type === "invoice";
  const labels = isInvoice ? INVOICE_STATUS_LABELS : QUOTATION_STATUS_LABELS;

  function handlePrint() {
    window.print();
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl flex flex-col p-0">
        <div className="border-b border-border p-5 print:hidden">
          <SheetHeader>
            <div className="flex items-start justify-between pr-8">
              <div>
                <SheetTitle className="flex items-center gap-2">
                  {doc.id}
                  <Badge variant={STATUS_VARIANTS[doc.status] || "default"}>
                    {labels[doc.status as keyof typeof labels]}
                  </Badge>
                </SheetTitle>
                <SheetDescription>Created on {new Date(doc.createdAt).toLocaleDateString()}</SheetDescription>
              </div>
            </div>
          </SheetHeader>
        </div>

        <SheetBody className="bg-surface/50 p-5 print:bg-white print:p-0">
          <DocumentPreview doc={doc} />
        </SheetBody>

        <SheetFooter className="border-t border-border p-4 flex-wrap sm:flex-nowrap print:hidden">
          <Button variant="secondary" className="flex-1" onClick={handlePrint}>
            <Printer /> Print
          </Button>
          
          {isInvoice ? (
            <>
              {(doc.status === "draft" || doc.status === "sent") && (
                <Button variant="outline" className="flex-1" onClick={() => onUpdateStatus(doc.id, "paid")}>
                  <CheckCircle /> Mark as Paid
                </Button>
              )}
              <Button className="flex-1" onClick={() => onUpdateStatus(doc.id, "sent")}>
                <Mail /> Send
              </Button>
            </>
          ) : (
            <>
              {doc.status === "draft" && (
                <Button variant="outline" className="flex-1" onClick={() => onUpdateStatus(doc.id, "accepted")}>
                  <CheckCircle /> Accept
                </Button>
              )}
              <Button className="flex-1" onClick={() => onConvert(doc.id)}>
                <ArrowRight /> Convert to Invoice
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}