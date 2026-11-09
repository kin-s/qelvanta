"use client";

import { useMemo, useState } from "react";
import { Search, MoreHorizontal, Eye, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select } from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  PO_STATUS_LABELS, PO_STATUS_VARIANTS, poProgressPct,
  type PurchaseOrder, type PurchaseOrderStatus,
} from "@/types/suppliers";

type SortKey = "id" | "createdAt" | "total";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 text-muted/50" />;
  return dir === "asc"
    ? <ArrowUp className="h-3 w-3 text-accent" />
    : <ArrowDown className="h-3 w-3 text-accent" />;
}

export function PurchaseOrderTable({
  purchaseOrders,
  onView,
  onDelete,
}: {
  purchaseOrders: PurchaseOrder[];
  onView: (po: PurchaseOrder) => void;
  onDelete: (po: PurchaseOrder) => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PurchaseOrderStatus | "">("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return purchaseOrders.filter((po) => {
      if (q && !(
        po.id.toLowerCase().includes(q) ||
        po.supplierName.toLowerCase().includes(q)
      )) return false;
      if (statusFilter && po.status !== statusFilter) return false;
      return true;
    });
  }, [purchaseOrders, search, statusFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      switch (sortKey) {
        case "id":
          return sortDir === "asc" ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
        case "createdAt":
          return sortDir === "asc"
            ? a.createdAt.localeCompare(b.createdAt)
            : b.createdAt.localeCompare(a.createdAt);
        case "total":
          return sortDir === "asc" ? a.total - b.total : b.total - a.total;
      }
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  }

  function resetFilters() {
    setSearch(""); setStatusFilter(""); setPage(1);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by PO number or supplier…"
            className="pl-9"
            aria-label="Search purchase orders"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as PurchaseOrderStatus | ""); setPage(1); }}
          aria-label="Filter by status"
          className="w-full sm:w-48"
        >
          <option value="">All statuses</option>
          {(Object.keys(PO_STATUS_LABELS) as PurchaseOrderStatus[]).map((s) => (
            <option key={s} value={s}>{PO_STATUS_LABELS[s]}</option>
          ))}
        </Select>
      </div>

      <Card>
        {sorted.length === 0 ? (
          <EmptyState
            className="border-0"
            title="No purchase orders match your filters"
            description="Try changing the search term or status filter, or create a new PO."
            action={<Button size="sm" variant="secondary" onClick={resetFilters}>Clear filters</Button>}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button type="button" onClick={() => toggleSort("id")} className="inline-flex items-center gap-1.5 hover:text-foreground">
                    PO <SortIcon active={sortKey === "id"} dir={sortDir} />
                  </button>
                </TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="hidden md:table-cell">
                  <button type="button" onClick={() => toggleSort("createdAt")} className="inline-flex items-center gap-1.5 hover:text-foreground">
                    Created <SortIcon active={sortKey === "createdAt"} dir={sortDir} />
                  </button>
                </TableHead>
                <TableHead className="hidden lg:table-cell">Expected</TableHead>
                <TableHead className="text-right">
                  <button type="button" onClick={() => toggleSort("total")} className="inline-flex items-center gap-1.5 hover:text-foreground">
                    Total <SortIcon active={sortKey === "total"} dir={sortDir} />
                  </button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell text-right">Received</TableHead>
                <TableHead className="w-10 text-right"><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((po) => {
                const progress = poProgressPct(po);
                return (
                  <TableRow key={po.id}>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => onView(po)}
                        className="tabular text-xs font-medium text-accent hover:underline"
                      >
                        {po.id}
                      </button>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{po.supplierName}</span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted">
                      {formatDate(po.createdAt, "en-US", { month: "short", day: "numeric" })}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted">
                      {formatDate(po.expectedDelivery, "en-US", { month: "short", day: "numeric" })}
                    </TableCell>
                    <TableCell className="tabular text-right font-medium">
                      {formatCurrency(po.total)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={PO_STATUS_VARIANTS[po.status]}>
                        {PO_STATUS_LABELS[po.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="tabular hidden sm:table-cell text-right text-xs text-muted">
                      {progress}%
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label={`Actions for ${po.id}`}>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{po.id}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onView(po)}>
                            <Eye /> View details
                          </DropdownMenuItem>
                          {(po.status === "draft" || po.status === "cancelled") && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-danger [&_svg]:text-danger"
                                onClick={() => onDelete(po)}
                              >
                                <Trash2 /> Delete
                              </DropdownMenuItem>
                            </>
                          )}
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

      {sorted.length > 0 && (
        <div className="flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted">
            Showing <strong className="text-foreground">{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, sorted.length)}</strong> of {sorted.length} purchase orders
          </p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => setPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
              Previous
            </Button>
            <span className="px-2 text-xs text-muted">Page {currentPage} of {totalPages}</span>
            <Button variant="ghost" size="sm" onClick={() => setPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}