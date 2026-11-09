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
import { cn } from "@/lib/utils";
import type { Supplier, PurchaseOrder } from "@/types/suppliers";

type SortKey = "name" | "country" | "paymentTerms" | "openPOs";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 text-muted/50" />;
  return dir === "asc"
    ? <ArrowUp className="h-3 w-3 text-accent" />
    : <ArrowDown className="h-3 w-3 text-accent" />;
}

export function SupplierTable({
  suppliers,
  purchaseOrders,
  onView,
  onEdit,
  onDelete,
}: {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  onView: (s: Supplier) => void;
  onEdit: (s: Supplier) => void;
  onDelete: (s: Supplier) => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "">("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  const openPOsBySupplier = useMemo(() => {
    const map = new Map<string, number>();
    for (const po of purchaseOrders) {
      if (po.status === "received" || po.status === "cancelled" || po.status === "draft") continue;
      map.set(po.supplierId, (map.get(po.supplierId) ?? 0) + 1);
    }
    return map;
  }, [purchaseOrders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return suppliers.filter((s) => {
      if (q && !(
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.contactName.toLowerCase().includes(q)
      )) return false;
      if (statusFilter && s.status !== statusFilter) return false;
      return true;
    });
  }, [suppliers, search, statusFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      switch (sortKey) {
        case "name":
          return sortDir === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case "country":
          return sortDir === "asc"
            ? a.country.localeCompare(b.country)
            : b.country.localeCompare(a.country);
        case "paymentTerms":
          return sortDir === "asc"
            ? a.paymentTerms.localeCompare(b.paymentTerms)
            : b.paymentTerms.localeCompare(a.paymentTerms);
        case "openPOs": {
          const av = openPOsBySupplier.get(a.id) ?? 0;
          const bv = openPOsBySupplier.get(b.id) ?? 0;
          return sortDir === "asc" ? av - bv : bv - av;
        }
      }
    });
    return arr;
  }, [filtered, sortKey, sortDir, openPOsBySupplier]);

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
    setStatusFilter("");
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
            placeholder="Search by name, contact, or email…"
            className="pl-9"
            aria-label="Search suppliers"
          />
        </div>
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

      <Card>
        {sorted.length === 0 ? (
          <EmptyState
            className="border-0"
            title="No suppliers match your filters"
            description="Try changing the search term, or add a new supplier."
            action={<Button size="sm" variant="secondary" onClick={resetFilters}>Clear filters</Button>}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button type="button" onClick={() => toggleSort("name")} className="inline-flex items-center gap-1.5 hover:text-foreground">
                    Supplier <SortIcon active={sortKey === "name"} dir={sortDir} />
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead className="hidden lg:table-cell">
                  <button type="button" onClick={() => toggleSort("country")} className="inline-flex items-center gap-1.5 hover:text-foreground">
                    Country <SortIcon active={sortKey === "country"} dir={sortDir} />
                  </button>
                </TableHead>
                <TableHead className="hidden sm:table-cell">
                  <button type="button" onClick={() => toggleSort("paymentTerms")} className="inline-flex items-center gap-1.5 hover:text-foreground">
                    Terms <SortIcon active={sortKey === "paymentTerms"} dir={sortDir} />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button type="button" onClick={() => toggleSort("openPOs")} className="inline-flex items-center gap-1.5 hover:text-foreground">
                    Open POs <SortIcon active={sortKey === "openPOs"} dir={sortDir} />
                  </button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10 text-right"><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((s) => {
                const openPOs = openPOsBySupplier.get(s.id) ?? 0;
                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => onView(s)}
                        className="flex flex-col items-start text-left hover:text-accent"
                      >
                        <span className="font-medium text-foreground">{s.name}</span>
                        {s.contactName && (
                          <span className="text-xs text-muted">{s.contactName}</span>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col text-xs">
                        {s.email && <span className="text-foreground">{s.email}</span>}
                        {s.phone && <span className="text-muted">{s.phone}</span>}
                        {!s.email && !s.phone && <span className="text-muted">—</span>}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted">
                      {s.country || "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted">
                      {s.paymentTerms}
                    </TableCell>
                    <TableCell className="tabular text-right">
                      <span className={cn(openPOs > 0 && "font-medium text-accent")}>
                        {openPOs}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={s.status === "active" ? "success" : "muted"}>
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label={`Actions for ${s.name}`}>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{s.name}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onView(s)}>
                            <Eye /> View profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(s)}>
                            <Pencil /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-danger [&_svg]:text-danger"
                            onClick={() => onDelete(s)}
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
            Showing <strong className="text-foreground">{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, sorted.length)}</strong> of {sorted.length} suppliers
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