import { formatCurrency, formatDate } from "@/lib/utils";
import type { BusinessDocument } from "@/types/invoices";

export function DocumentPreview({ doc }: { doc: BusinessDocument }) {
  const isInvoice = doc.type === "invoice";
  const dueLabel = isInvoice ? "Due Date" : "Expires";
  const dueDate = isInvoice
    ? (doc as import("@/types/invoices").Invoice).dueDate
    : (doc as import("@/types/invoices").Quotation).expiryDate;

  return (
    <div className="mx-auto w-full max-w-2xl rounded-lg border border-border bg-card p-8 shadow-sm print:border-0 print:shadow-none print:p-0">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-border pb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">QELVANTA</h1>
          <p className="mt-1 text-sm text-muted">Demo Business Inc.</p>
          <p className="text-xs text-muted">123 Commerce St, NY</p>
        </div>
        <div className="text-right">
          <h2 className="font-heading text-2xl font-semibold uppercase tracking-wider text-muted">
            {isInvoice ? "Invoice" : "Quotation"}
          </h2>
          <p className="mt-1 font-medium">{doc.id}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">Billed To</p>
          <p className="font-medium">{doc.customerName}</p>
          <p className="text-muted">{doc.customerEmail || "No email provided"}</p>
        </div>
        <div className="text-right">
          <div className="space-y-1">
            <div>
              <span className="text-muted">Issue Date: </span>
              <span className="font-medium">{formatDate(doc.issueDate)}</span>
            </div>
            <div>
              <span className="text-muted">{dueLabel}: </span>
              <span className="font-medium">{formatDate(dueDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="mt-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-border text-left">
              <th className="py-2 font-semibold text-muted">Description</th>
              <th className="py-2 text-center font-semibold text-muted">Qty</th>
              <th className="py-2 text-right font-semibold text-muted">Price</th>
              <th className="py-2 text-right font-semibold text-muted">Amount</th>
            </tr>
          </thead>
          <tbody>
            {doc.items.map((item) => (
              <tr key={item.id} className="border-b border-border/50">
                <td className="py-3">{item.description}</td>
                <td className="tabular py-3 text-center">{item.quantity}</td>
                <td className="tabular py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                <td className="tabular py-3 text-right">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mt-6 flex justify-end">
        <div className="w-64 space-y-2 text-sm">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span className="tabular">{formatCurrency(doc.subtotal)}</span>
          </div>
          {doc.discountAmount > 0 && (
            <div className="flex justify-between text-muted">
              <span>Discount ({doc.discountPct}%)</span>
              <span className="tabular">−{formatCurrency(doc.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-muted">
            <span>Tax ({doc.taxRate * 100}%)</span>
            <span className="tabular">{formatCurrency(doc.taxAmount)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 font-heading text-lg font-bold">
            <span>Total</span>
            <span className="tabular">{formatCurrency(doc.total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {doc.notes && (
        <div className="mt-8 rounded-md bg-surface p-4 text-sm text-muted print:bg-transparent print:p-0">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-foreground">Notes</p>
          {doc.notes}
        </div>
      )}

      <div className="mt-12 text-center text-xs text-muted print:mt-8">
        <p>Thank you for your business.</p>
        <p className="mt-1">Payment terms apply. Please contact support@qelvanta.example for any questions.</p>
      </div>
    </div>
  );
}