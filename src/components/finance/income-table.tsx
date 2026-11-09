"use client";

import { useMemo, useState } from "react";
import { Search, MoreHorizontal, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "@/lib/utils";
import { INCOME_CATEGORY_LABELS, type Income } from "@/types/finance";

export function IncomeTable({ income, onDelete }: { income: Income[]; onDelete: (id: string) => void }) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return income.filter(i => {
      if (q && !i.title.toLowerCase().includes(q) && !i.source.toLowerCase().includes(q)) return false;
      return true;
    }).sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [income, search]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search income..." className="pl-9" />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Source</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(i => (
              <TableRow key={i.id}>
                <TableCell className="text-xs text-muted whitespace-nowrap">{formatDate(i.date, "en-US", { month: "short", day: "numeric", year: "numeric" })}</TableCell>
                <TableCell className="font-medium">{i.title}</TableCell>
                <TableCell className="hidden sm:table-cell text-xs text-muted">{INCOME_CATEGORY_LABELS[i.category]}</TableCell>
                <TableCell className="hidden md:table-cell text-xs text-muted">{i.source || "—"}</TableCell>
                <TableCell className="tabular text-right font-medium text-success">{formatCurrency(i.amount)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onDelete(i.id)} className="text-danger [&_svg]:text-danger">
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