import { Download, ReceiptText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { BillingRecord } from "@/types/billing";

export function BillingHistory({ records }: { records: BillingRecord[] }) {
  function handleDownload(id: string) {
    toast.success("Downloading receipt", { description: `${id}.pdf would download in production.` });
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading text-lg font-semibold">Billing History</h3>
        <p className="text-sm text-muted">View and download your past subscription invoices.</p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="hidden sm:table-cell">Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  <ReceiptText className="h-4 w-4 text-muted" />
                  {r.id}
                </TableCell>
                <TableCell className="text-sm text-muted">{formatDate(r.date)}</TableCell>
                <TableCell className="hidden sm:table-cell text-sm">{r.planName}</TableCell>
                <TableCell>
                  <Badge variant={r.status === "paid" ? "success" : r.status === "pending" ? "warning" : "danger"}>
                    {r.status}
                  </Badge>
                </TableCell>
                <TableCell className="tabular text-right font-medium">{formatCurrency(r.amount)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleDownload(r.id)} aria-label="Download invoice">
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}