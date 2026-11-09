"use client";

import { useMemo, useState } from "react";
import {
  Search, MoreHorizontal, Eye, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown,
} from "lucide-react";
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
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import {
  SEGMENT_LABELS, SEGMENT_VARIANTS,
  type Customer,
  type CustomerSegment,
} from "@/types/customers";
import type { Sale } from "@/types/sales";

type SortKey = "name" | "segment" | "createdAt" | "totalPurchases";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 text-muted/50" />;
  return dir === "asc"
    ? <ArrowUp className="h-3 w-3 text-accent" />
    : <ArrowDown className="h-3 w-3 text-accent" />;
}

interface RowStats {
  totalPurchases: number;
  outstanding: number;
  lastPurchaseAt: string | null;
}

export function CustomerTable({
  customers,
  sales,
  onView,
  onEdit,
  onDelete,
}: {
  customers: Customer[];
  sales: Sale[];
  onView: (c: Customer) => void;
  onEdit: (c: Customer) => void;
  onDelete: (c: Customer) => void;
}) {
  const [search, setSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState<CustomerSegment | "">("");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "">("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  const statsByCustomer = useMemo(() => {
    const stats = new Map<string, RowStats>();
    for (const sale of sales) {
      if (!sale.customerId) continue;
      const refunded = (sale.refunds ?? []).reduce((s, r) => s + r.amount, 0);
      const net = Math.max(0, sale.total - refunded);
      const existing = stats.get(sale.customerId) ?? {
        totalPurchases: 0,
        outstanding: 0,
        lastPurchaseAt: null,
      };
      existing.totalPurchases += sale.total;
      existing.outstanding += net;
      if (!existing.lastPurchaseAt || sale.createdAt > existing.lastPurchaseAt) {
        existing.lastPurchaseAt = sale.createdAt;
      }
      stats.set(sale.customerId, existing);
    }
    return stats;
  }, [sales]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return customers.filter((c) => {
      if (q && !(
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q)
      )) return false;
      if (segmentFilter && c.segment !== segmentFilter) return false;
      if (statusFilter && c.status !== statusFilter) return false;
      return true;
    });
  }, [customers, search, segmentFilter, statusFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const statsA = statsByCustomer.get(a.id);
      const statsB = statsByCustomer.get(b.id);
      switch (sortKey) {
        case "name":
          return sortDir === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case "segment":
          return sortDir === "asc"
            ? a.segment.localeCompare(b.segment)
            : b.segment.localeCompare(a.segment);
        case "createdAt":
          return sortDir === "asc"
            ? a.createdAt.localeCompare(b.createdAt)
            : b.createdAt.localeCompare(a.createdAt);
        case "totalPurchases": {
          const av = statsA?.totalPurchases ?? 0;
          const bv = statsB?.totalPurchases ?? 0;
          return sortDir === "asc" ? av - bv : bv - av;
        }
      }
    });
    return arr;
  }, [filtered, sortKey, sortDir, statsByCustomer]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  }

  function resetFilters() {
    setSearch("");
    setSegmentFilter("");
    setStatusFilter("");
    setPage(1);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, phone, or company…"
            className="pl-9"
            aria-label="Search customers"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={segmentFilter}
            onChange={(e) => { setSegmentFilter(e.target.value as CustomerSegment | ""); setPage(1); }}
            aria-label="Filter by segment"
            className="w-full sm:w-40"
          >
            <option value="">All segments</option>
            {(Object.keys(SEGMENT_LABELS) as CustomerSegment[]).map((s) => (
              <option key={s} value={s}>{SEGMENT_LABELS[s]}</option>
            ))}
          </Select>
          <Select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as "active" | "inactive" | ""); setPage(1); }}
            aria-label="Filter by status"
            className="w-full sm:w-40"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>
      </div>

      <Card>
        {sorted.length === 0 ? (
          <EmptyState
            className="border-0"
            title="No customers match your filters"
            description="Try changing the search term or filter, or add a new customer."
            action={
              <Button size="sm" variant="secondary" onClick={resetFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button type="button" onClick={() => toggleSort("name")} className="inline-flex items-center gap-1.5 hover:text-foreground">
                    Customer <SortIcon active={sortKey === "name"} dir={sortDir} />
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead className="hidden lg:table-cell">Country</TableHead>
                <TableHead>
                  <button type="button" onClick={() => toggleSort("segment")} className="inline-flex items-center gap-1.5 hover:text-foreground">
                    Segment <SortIcon active={sortKey === "segment"} dir={sortDir} />
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell text-right">
                  <button type="button" onClick={() => toggleSort("totalPurchases")} className="inline-flex items-center gap-1.5 hover:text-foreground">
                    Purchases <SortIcon active={sortKey === "totalPurchases"} dir={sortDir} />
                  </button>
                </TableHead>
                <TableHead className="text-right">Outstanding</TableHead>
                <TableHead className="hidden xl:table-cell">Last purchase</TableHead>
                <TableHead className="w-10 text-right"><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((c) => {
                const stats = statsByCustomer.get(c.id);
                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => onView(c)}
                        className="flex flex-col items-start text-left hover:text-accent"
                      >
                        <span className="font-medium text-foreground">
                          {c.name}
                          {c.status === "inactive" && (
                            <Badge variant="muted" className="ml-2">inactive</Badge>
                          )}
                        </span>
                        {c.company && (
                          <span className="text-xs text-muted">{c.company}</span>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col text-xs">
                        {c.email && <span className="text-foreground">{c.email}</span>}
                        {c.phone && <span className="text-muted">{c.phone}</span>}
                        {!c.email && !c.phone && <span className="text-muted">—</span>}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted">
                      {c.country || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={SEGMENT_VARIANTS[c.segment]}>
                        {SEGMENT_LABELS[c.segment]}
                      </Badge>
                    </TableCell>
                    <TableCell className="tabular hidden md:table-cell text-right">
                      {formatCurrency(stats?.totalPurchases ?? 0)}
                    </TableCell>
                    <TableCell className="tabular text-right">
                      <span className={cn((stats?.outstanding ?? 0) > 0 && "text-warning")}>
                        {formatCurrency(stats?.outstanding ?? 0)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell text-xs text-muted">
                      {stats?.lastPurchaseAt
                        ? formatDate(stats.lastPurchaseAt, "en-US", { month: "short", day: "numeric" })
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label={`Actions for ${c.name}`}>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{c.name}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onView(c)}>
                            <Eye /> View profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(c)}>
                            <Pencil /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-danger [&_svg]:text-danger"
                            onClick={() => onDelete(c)}
                          >
                            <Trash2 /> Delete
                          </DropdownMenuItem>
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
            Showing{" "}
            <strong className="text-foreground">
              {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, sorted.length)}
            </strong>{" "}
            of {sorted.length} customers
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="px-2 text-xs text-muted">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}