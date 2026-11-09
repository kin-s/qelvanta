"use client";

import { useMemo, useState } from "react";
import { Search, MoreHorizontal, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select } from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import { EXPENSE_CATEGORY_LABELS, type Expense, type ExpenseCategory } from "@/types/finance";

export function ExpenseTable({
  expenses, onDelete
}: {
  expenses: Expense[]; onDelete: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | "">("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return expenses.filter(e => {
      if (q && !e.title.toLowerCase().includes(q) && !e.supplier.toLowerCase().includes(q)) return false;
      if (categoryFilter && e.category !== categoryFilter) return false;
      return true;
    }).sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [expenses, search, categoryFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search expenses..." className="pl-9" />
        </div>
        <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as ExpenseCategory | "")} className="sm:w-48">
          <option value="">All categories</option>
          {(Object.keys(EXPENSE_CATEGORY_LABELS) as ExpenseCategory[]).map(c => (
            <option key={c} value={c}>{EXPENSE_CATEGORY_LABELS[c]}</option>
          ))}
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(e => (
              <TableRow key={e.id}>
                <TableCell className="text-xs text-muted whitespace-nowrap">{formatDate(e.date, "en-US", { month: "short", day: "numeric", year: "numeric" })}</TableCell>
                <TableCell>
                  <p className="font-medium">{e.title}</p>
                  {e.supplier && <p className="text-[10px] text-muted">{e.supplier}</p>}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-xs text-muted">{EXPENSE_CATEGORY_LABELS[e.category]}</TableCell>
                <TableCell className="hidden md:table-cell text-xs text-muted capitalize">{e.paymentMethod.replace("_", " ")}</TableCell>
                <TableCell>
                  <Badge variant={e.status === "paid" ? "success" : "warning"}>{e.status}</Badge>
                </TableCell>
                <TableCell className="tabular text-right font-medium">{formatCurrency(e.amount)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onDelete(e.id)} className="text-danger [&_svg]:text-danger">
                        <Trash2 /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}