import { Package, Boxes, DollarSign, AlertTriangle, XCircle, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { stockStatusOf, type Product, type Category } from "@/types/inventory";

export function InventoryOverview({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const totalQuantity = products.reduce((s, p) => s + p.stockQuantity, 0);
  const inventoryValue = products.reduce(
    (s, p) => s + p.purchasePrice * p.stockQuantity,
    0
  );
  const lowCount = products.filter((p) => stockStatusOf(p) === "low").length;
  const outCount = products.filter((p) => stockStatusOf(p) === "out").length;

  const cards = [
    { label: "Total products", value: products.length.toString(), icon: Package, hint: "Active SKUs in the catalogue." },
    { label: "Total stock", value: totalQuantity.toLocaleString("en-US"), icon: Boxes, hint: "Combined quantity across all warehouses." },
    { label: "Inventory value", value: formatCurrency(inventoryValue), icon: DollarSign, hint: "At purchase price — not retail." },
    { label: "Low stock", value: lowCount.toString(), icon: AlertTriangle, hint: "Products at or below reorder level.", variant: "warning" as const },
    { label: "Out of stock", value: outCount.toString(), icon: XCircle, hint: "Products with zero units on hand.", variant: "danger" as const },
    { label: "Categories", value: categories.length.toString(), icon: Tag, hint: "Product categories in use." },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">{c.label}</p>
                  <p className="tabular mt-2 font-heading text-2xl font-semibold">
                    {c.value}
                  </p>
                  <p className="mt-1 text-[11px] text-muted">{c.hint}</p>
                </div>
                <div
                  className={
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-md " +
                    (c.variant === "warning"
                      ? "bg-warning/15 text-warning"
                      : c.variant === "danger"
                        ? "bg-danger/15 text-danger"
                        : "bg-accent/10 text-accent")
                  }
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}