"use client";

import { useMemo, useState } from "react";
import { Search, MoreHorizontal, Eye, Trash2, Printer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Select } from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import { INVOICE_STATUS_LABELS, QUOTATION_STATUS_LABELS, STATUS_VARIANTS, type Invoice, type Quotation, type BusinessDocument } from "@/types/invoices";

export function InvoiceTable({
  docs, type, onView, onDelete
}: {
  docs: BusinessDocument[];
  type: "invoice" | "quotation";
  onView: (doc: BusinessDocument) => void;
  onDelete: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const isInvoice = type === "invoice";
  const statusLabels = isInvoice ? INVOICE_STATUS_LABELS : QUOTATION_STATUS_LABELS;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return docs.filter(d => {
      if (q && !d.id.toLowerCase().includes(q) && !d.customerName.toLowerCase().includes(q)) return false;
      if (statusFilter && d.status !== statusFilter) return false;
      return true;
    }).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [docs, search, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${type}s...`} className="pl-9" />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-40">
          <option value="">All statuses</option>
          {Object.entries(statusLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </Select>
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState title={`No ${type}s found`} description="Try a different search or create a new one." className="border-0" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Issued</TableHead>
                <TableHead className="hidden md:table-cell">{isInvoice ? "Due" : "Expires"}</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(d => {
                const dueDate = isInvoice ? (d as Invoice).dueDate : (d as Quotation).expiryDate;
                return (
                  <TableRow key={d.id}>
                    <TableCell>
                      <button onClick={() => onView(d)} className="tabular text-xs font-medium text-accent hover:underline">{d.id}</button>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{d.customerName}</p>
                      <p className="text-[10px] text-muted">{d.customerEmail}</p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted">{formatDate(d.issueDate)}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted">{formatDate(dueDate)}</TableCell>
                    <TableCell className="tabular text-right font-medium">{formatCurrency(d.total)}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[d.status] || "default"}>
                        {statusLabels[d.status as keyof typeof statusLabels]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{d.id}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onView(d)}><Eye /> View</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onView(d)}><Printer /> Print</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onDelete(d.id)} className="text-danger [&_svg]:text-danger"><Trash2 /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}