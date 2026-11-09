"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, Pencil, Copy, Trash2, Search, Eye,
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
import { formatCurrency, cn } from "@/lib/utils";
import { stockStatusOf, type Product, type Category, type StockStatus } from "@/types/inventory";

type SortKey = "name" | "sku" | "sellingPrice" | "stockQuantity";
type SortDir = "asc" | "desc";
type Filter = "all" | "active" | "inactive" | "low" | "out";

const PAGE_SIZE = 10;

function StockBadge({ status }: { status: StockStatus }) {
  if (status === "out") return <Badge variant="danger">Out of stock</Badge>;
  if (status === "low") return <Badge variant="warning">Low stock</Badge>;
  return <Badge variant="success">In stock</Badge>;
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 text-muted/50" />;
  return dir === "asc"
    ? <ArrowUp className="h-3 w-3 text-accent" />
    : <ArrowDown className="h-3 w-3 text-accent" />;
}

export function ProductTable({
  products,
  categories,
  onEdit,
  onDuplicate,
  onDelete,
  onBulkDelete,
  onView,
}: {
  products: Product[];
  categories: Category[];
  onEdit: (p: Product) => void;
  onDuplicate: (p: Product) => void;
  onDelete: (p: Product) => void;
  onBulkDelete: (ids: string[]) => void;
  onView: (p: Product) => void;
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<Filter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? "—";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (q && !(
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q)
      )) return false;
      if (categoryFilter && p.categoryId !== categoryFilter) return false;
      const status = stockStatusOf(p);
      if (statusFilter === "active" && p.status !== "active") return false;
      if (statusFilter === "inactive" && p.status !== "inactive") return false;
      if (statusFilter === "low" && status !== "low") return false;
      if (statusFilter === "out" && status !== "out") return false;
      return true;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      const an = Number(av);
      const bn = Number(bv);
      return sortDir === "asc" ? an - bn : bn - an;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const allOnPageSelected =
    pageItems.length > 0 && pageItems.every((p) => selected.has(p.id));

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  }

  function toggleRow(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  }

  function toggleAllOnPage() {
    if (allOnPageSelected) {
      const next = new Set(selected);
      pageItems.forEach((p) => next.delete(p.id));
      setSelected(next);
    } else {
      const next = new Set(selected);
      pageItems.forEach((p) => next.add(p.id));
      setSelected(next);
    }
  }

  function resetFilters() {
    setSearch(""); setCategoryFilter(""); setStatusFilter("all"); setPage(1); setSelected(new Set());
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, SKU, barcode…"
            className="pl-9"
            aria-label="Search products"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            aria-label="Filter by category"
            className="w-full sm:w-44"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
          <Select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as Filter); setPage(1); }}
            aria-label="Filter by status"
            className="w-full sm:w-40"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
          </Select>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center justify-between rounded-md border border-accent/40 bg-accent/5 px-4 py-2">
          <span className="text-sm text-foreground">
            <strong className="tabular">{selected.size}</strong> selected
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Clear</Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => { onBulkDelete(Array.from(selected)); setSelected(new Set()); }}
            >
              <Trash2 /> Delete selected
            </Button>
          </div>
        </div>
      )}

      <Card>
        {sorted.length === 0 ? (
          <EmptyState
            className="border-0"
            title="No products match your filters"
            description="Try changing the search term or filter, or add a new product."
            action={<Button size="sm" variant="secondary" onClick={resetFilters}>Clear filters</Button>}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={toggleAllOnPage}
                    className="h-4 w-4 rounded border-border accent-accent"
                    aria-label="Select all on page"
                  />
                </TableHead>
                <TableHead>
                  <button type="button" onClick={() => toggleSort("name")} className="inline-flex items-center gap-1.5 hover:text-foreground">
                    Product <SortIcon active={sortKey === "name"} dir={sortDir} />
                  </button>
                </TableHead>
                <TableHead>
                  <button type="button" onClick={() => toggleSort("sku")} className="inline-flex items-center gap-1.5 hover:text-foreground">
                    SKU <SortIcon active={sortKey === "sku"} dir={sortDir} />
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>
                  <button type="button" onClick={() => toggleSort("sellingPrice")} className="inline-flex items-center gap-1.5 hover:text-foreground">
                    Price <SortIcon active={sortKey === "sellingPrice"} dir={sortDir} />
                  </button>
                </TableHead>
                <TableHead>
                  <button type="button" onClick={() => toggleSort("stockQuantity")} className="inline-flex items-center gap-1.5 hover:text-foreground">
                    Stock <SortIcon active={sortKey === "stockQuantity"} dir={sortDir} />
                  </button>
                </TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="w-10 text-right"><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((p) => {
                const status = stockStatusOf(p);
                const isSel = selected.has(p.id);
                return (
                  <TableRow key={p.id} className={cn(isSel && "bg-accent/5")}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={isSel}
                        onChange={() => toggleRow(p.id)}
                        className="h-4 w-4 rounded border-border accent-accent"
                        aria-label={`Select ${p.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => onView(p)}
                        className="flex flex-col text-left hover:text-accent"
                      >
                        <span className="font-medium text-foreground">{p.name}</span>
                        <span className="text-xs text-muted">{p.brand || "—"}</span>
                      </button>
                    </TableCell>
                    <TableCell className="tabular text-sm text-muted">{p.sku}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm text-muted">{categoryName(p.categoryId)}</span>
                    </TableCell>
                    <TableCell className="tabular">{formatCurrency(p.sellingPrice)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="tabular text-sm font-medium">{p.stockQuantity}</span>
                        <StockBadge status={status} />
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={p.status === "active" ? "success" : "muted"}>{p.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label={`Actions for ${p.name}`}>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{p.name}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onView(p)}><Eye /> View</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(p)}><Pencil /> Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDuplicate(p)}><Copy /> Duplicate</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-danger [&_svg]:text-danger"
                            onClick={() => onDelete(p)}
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
            Showing <strong className="text-foreground">{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, sorted.length)}</strong> of {sorted.length} products
          </p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => setPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>Previous</Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                aria-current={p === currentPage ? "page" : undefined}
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-sm text-xs font-medium transition-colors",
                  p === currentPage ? "bg-accent text-[#111111]" : "text-muted hover:bg-card hover:text-foreground"
                )}
              >
                {p}
              </button>
            ))}
            <Button variant="ghost" size="sm" onClick={() => setPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}