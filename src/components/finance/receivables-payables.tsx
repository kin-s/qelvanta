"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { AgingRecord } from "@/types/finance";

export function ReceivablesPayables({ receivables, payables }: { receivables: AgingRecord[]; payables: AgingRecord[] }) {
  const [tab, setTab] = useState<"ar" | "ap">("ar");
  const data = tab === "ar" ? receivables : payables;

  return (
    <Card className="overflow-hidden">
      <div className="flex border-b border-border bg-surface/30">
        <button onClick={() => setTab("ar")} className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${tab === "ar" ? "border-accent text-foreground" : "border-transparent text-muted hover:text-foreground"}`}>
          Accounts Receivable
        </button>
        <button onClick={() => setTab("ap")} className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${tab === "ap" ? "border-accent text-foreground" : "border-transparent text-muted hover:text-foreground"}`}>
          Accounts Payable
        </button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{tab === "ar" ? "Customer" : "Supplier"}</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead className="text-right">Original</TableHead>
            <TableHead className="text-right">Paid</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="hidden sm:table-cell">Due Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(d => {
            const balance = d.originalAmount - d.paidAmount;
            return (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d.partyName}</TableCell>
                <TableCell className="tabular text-xs text-muted">{d.reference}</TableCell>
                <TableCell className="tabular text-right text-muted">{formatCurrency(d.originalAmount)}</TableCell>
                <TableCell className="tabular text-right text-muted">{formatCurrency(d.paidAmount)}</TableCell>
                <TableCell className="tabular text-right font-medium">{formatCurrency(balance)}</TableCell>
                <TableCell className="hidden sm:table-cell text-xs text-muted">{formatDate(d.dueDate, "en-US", { month: "short", day: "numeric" })}</TableCell>
                <TableCell>
                  <Badge variant={d.status === "paid" ? "success" : d.status === "overdue" ? "danger" : "info"}>
                    {d.status}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}