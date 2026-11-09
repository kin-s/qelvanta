"use client";

import { useMemo, useState } from "react";
import { Search, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, cn } from "@/lib/utils";
import type { Product, Category } from "@/types/inventory";
import { stockStatusOf } from "@/types/inventory";

export function PosProductGrid({
  products,
  categories,
  onAdd,
}: {
  products: Product[];
  categories: Category[];
  onAdd: (p: Product) => void;
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const visibleCategories = useMemo(
    () =>
      categories.filter((c) =>
        products.some((p) => p.categoryId === c.id)
      ),
    [categories, products]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products
      .filter((p) => p.status === "active")
      .filter((p) => {
        if (q && !(
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.barcode.toLowerCase().includes(q)
        )) return false;
        if (categoryFilter && p.categoryId !== categoryFilter) return false;
        return true;
      });
  }, [products, search, categoryFilter]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products or scan barcode…"
          className="h-11 pl-9"
          aria-label="Search products"
        />
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setCategoryFilter("")}
          className={cn(
            "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            categoryFilter === ""
              ? "bg-accent text-[#111111]"
              : "border border-border bg-card text-muted hover:text-foreground"
          )}
        >
          All
        </button>
        {visibleCategories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategoryFilter(c.id)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              categoryFilter === c.id
                ? "bg-accent text-[#111111]"
                : "border border-border bg-card text-muted hover:text-foreground"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Package />}
          title="No products match your search"
          description="Try a different search term or category."
        />
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((p) => {
            const status = stockStatusOf(p);
            const out = status === "out";
            return (
              <button
                key={p.id}
                type="button"
                disabled={out}
                onClick={() => onAdd(p)}
                className={cn(
                  "group flex flex-col items-start gap-1.5 rounded-lg border border-border bg-card p-3 text-left transition-all",
                  out
                    ? "cursor-not-allowed opacity-50"
                    : "hover:border-accent/60 hover:bg-accent/5 active:scale-[0.98]"
                )}
              >
                <div className="flex w-full items-start justify-between gap-1">
                  <span className="line-clamp-2 text-sm font-medium text-foreground">
                    {p.name}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted">
                  {p.sku}
                </span>
                <div className="mt-auto flex w-full items-end justify-between gap-1 pt-1">
                  <span className="tabular text-sm font-semibold text-accent">
                    {formatCurrency(p.sellingPrice)}
                  </span>
                  {out ? (
                    <Badge variant="danger">Out</Badge>
                  ) : status === "low" ? (
                    <Badge variant="warning">{p.stockQuantity}</Badge>
                  ) : (
                    <span className="text-[10px] text-muted">{p.stockQuantity} left</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}