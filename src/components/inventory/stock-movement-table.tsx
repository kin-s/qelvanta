"use client";

import { useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { formatDate, cn } from "@/lib/utils";
import type { MovementType, StockMovement } from "@/types/inventory";

const PAGE_SIZE = 12;

const TYPE_META: Record<MovementType, { label: string; variant: "success" | "info" | "warning" | "accent" | "danger" | "muted" }> = {
  received: { label: "Received", variant: "success" },
  sold: { label: "Sold", variant: "info" },
  returned: { label: "Returned", variant: "warning" },
  adjustment: { label: "Adjustment", variant: "accent" },
  transfer: { label: "Transfer", variant: "muted" },
  damaged: { label: "Damaged", variant: "danger" },
};

export function StockMovementTable({
  movements,
  onRecord,
}: {
  movements: StockMovement[];
  onRecord: () => void;
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<MovementType | "">("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return movements.filter((m) => {
      if (q && !(
        m.productName.toLowerCase().includes(q) ||
        m.reference.toLowerCase().includes(q)
      )) return false;
      if (typeFilter && m.type !== typeFilter) return false;
      return true;
    });
  }, [movements, search, typeFilter]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [filtered]
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function reset() {
    setSearch("");
    setTypeFilter("");
    setPage(1);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by product or reference…"
            className="pl-9"
            aria-label="Search movements"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value as MovementType | ""); setPage(1); }}
            aria-label="Filter by movement type"
            className="w-full sm:w-44"
          >
            <option value="">All types</option>
            {(Object.keys(TYPE_META) as MovementType[]).map((t) => (
              <option key={t} value={t}>{TYPE_META[t].label}</option>
            ))}
          </Select>
          <Button onClick={onRecord}>
            <Plus />
            Record movement
          </Button>
        </div>
      </div>

      <Card>
        {sorted.length === 0 ? (
          <EmptyState
            className="border-0"
            title="No stock movements match your filters"
            description="Try changing the filters, or record a new stock movement."
            action={
              <Button size="sm" variant="secondary" onClick={reset}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="hidden md:table-cell">Locations</TableHead>
                <TableHead className="hidden lg:table-cell">Reference</TableHead>
                <TableHead className="hidden md:table-cell">User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((m) => {
                const meta = TYPE_META[m.type];
                return (
                  <TableRow key={m.id}>
                    <TableCell className="whitespace-nowrap text-xs text-muted">
                      {formatDate(m.date, "en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{m.productName}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          "tabular text-sm font-medium",
                          m.quantityDelta > 0 ? "text-success" : "text-danger"
                        )}
                      >
                        {m.quantityDelta > 0 ? "+" : ""}
                        {m.quantityDelta}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-xs text-muted">
                        {m.sourceLocation} → {m.destinationLocation}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="tabular text-xs text-muted">{m.reference}</span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-xs text-muted">{m.user}</span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {sorted.length > 0 && (
        <div className="flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted">
            Showing <strong className="text-foreground">{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, sorted.length)}</strong> of {sorted.length} movements
          </p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => setPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
              Previous
            </Button>
            <span className="px-2 text-xs text-muted">
              Page {currentPage} of {totalPages}
            </span>
            <Button variant="ghost" size="sm" onClick={() => setPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}