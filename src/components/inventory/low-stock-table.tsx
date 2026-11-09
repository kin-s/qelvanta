"use client";

import { useMemo } from "react";
import { ShoppingCart, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { stockStatusOf, type Product } from "@/types/inventory";

export function suggestedReorderQuantity(p: Product): number {
  // Top up to 2× reorder level, minimum reorder level itself.
  return Math.max(p.reorderLevel * 2 - p.stockQuantity, p.reorderLevel);
}

export function LowStockTable({
  products,
  onReorder,
}: {
  products: Product[];
  onReorder: (p: Product, suggestedQty: number) => void;
}) {
  const rows = useMemo(() => {
    return products
      .filter((p) => {
        const s = stockStatusOf(p);
        return s === "low" || s === "out";
      })
      .sort((a, b) => {
        const sa = stockStatusOf(a);
        const sb = stockStatusOf(b);
        if (sa === "out" && sb !== "out") return -1;
        if (sb === "out" && sa !== "out") return 1;
        return a.stockQuantity - b.stockQuantity;
      });
  }, [products]);

  if (rows.length === 0) {
    return (
      <EmptyState
        title="All stock is healthy"
        description="No products are at or below their reorder level right now."
      />
    );
  }

  const outCount = rows.filter((p) => stockStatusOf(p) === "out").length;
  const lowCount = rows.length - outCount;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-danger/15 text-danger">
              <XCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted">Out of stock</p>
              <p className="tabular font-heading text-xl font-semibold">{outCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-warning/15 text-warning">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted">Low stock</p>
              <p className="tabular font-heading text-xl font-semibold">{lowCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/10 text-accent">
              <ShoppingCart className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted">Total needing reorder</p>
              <p className="tabular font-heading text-xl font-semibold">{rows.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="hidden md:table-cell">SKU</TableHead>
              <TableHead className="text-right">Current</TableHead>
              <TableHead className="text-right">Reorder at</TableHead>
              <TableHead className="text-right">Suggested</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p) => {
              const suggested = suggestedReorderQuantity(p);
              const status = stockStatusOf(p);
              return (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{p.name}</span>
                      <span className="text-xs text-muted">{p.brand || "—"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="tabular hidden md:table-cell text-sm text-muted">
                    {p.sku}
                  </TableCell>
                  <TableCell className="tabular text-right font-medium">
                    {p.stockQuantity}
                  </TableCell>
                  <TableCell className="tabular text-right text-sm text-muted">
                    {p.reorderLevel}
                  </TableCell>
                  <TableCell className="tabular text-right font-medium text-accent">
                    {suggested}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {status === "out" ? (
                      <Badge variant="danger">Out of stock</Badge>
                    ) : (
                      <Badge variant="warning">Low stock</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="secondary" onClick={() => onReorder(p, suggested)}>
                      <ShoppingCart />
                      Reorder
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}