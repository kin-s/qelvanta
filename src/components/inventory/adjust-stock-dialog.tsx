"use client";

import { useEffect } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MovementType, Product, StockMovement } from "@/types/inventory";

const ADJUSTABLE_TYPES: { value: Exclude<MovementType, "transfer">; label: string }[] = [
  { value: "received", label: "Received (add stock)" },
  { value: "sold", label: "Sold (remove stock)" },
  { value: "returned", label: "Returned (add stock)" },
  { value: "damaged", label: "Damaged (remove stock)" },
  { value: "adjustment", label: "Adjustment (any direction)" },
];

const schema = z.object({
  productId: z.string().min(1, "Select a product"),
  type: z.enum(["received", "sold", "returned", "damaged", "adjustment"]),
  quantity: z.coerce.number().int("Must be a whole number"),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export interface AdjustStockInitial {
  productId?: string;
  type?: Exclude<MovementType, "transfer">;
  quantity?: number;
}

export function AdjustStockDialog({
  open,
  onOpenChange,
  products,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  initial?: AdjustStockInitial;
  onSubmit: (m: StockMovement) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      productId: "",
      type: "received",
      quantity: 1,
      reference: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        productId: initial?.productId ?? products[0]?.id ?? "",
        type: initial?.type ?? "received",
        quantity: initial?.quantity ?? 1,
        reference: "",
        notes: "",
      });
    }
  }, [open, initial, products, reset]);

  const currentType = useWatch({ control, name: "type" }) ?? "received";
  const currentProductId = useWatch({ control, name: "productId" }) ?? "";
  const currentProduct = products.find((p) => p.id === currentProductId);
  const isAdjustment = currentType === "adjustment";

  function submit(values: FormValues) {
    const product = products.find((p) => p.id === values.productId);
    if (!product) return;
    if (values.quantity === 0) return;

    let delta = values.quantity;
    let source = product.warehouseId === "wh_main" ? "Main warehouse" : "Store front";
    let destination = source;

    if (values.type === "received") {
      delta = Math.abs(values.quantity);
      source = `Supplier${product.brand ? `: ${product.brand}` : ""}`;
      destination = product.warehouseId === "wh_main" ? "Main warehouse" : "Store front";
    } else if (values.type === "sold") {
      delta = -Math.abs(values.quantity);
      source = product.warehouseId === "wh_main" ? "Main warehouse" : "Store front";
      destination = "Customer";
    } else if (values.type === "returned") {
      delta = Math.abs(values.quantity);
      source = "Customer";
      destination = product.warehouseId === "wh_main" ? "Main warehouse" : "Store front";
    } else if (values.type === "damaged") {
      delta = -Math.abs(values.quantity);
      source = product.warehouseId === "wh_main" ? "Main warehouse" : "Store front";
      destination = "Damaged";
    } else if (values.type === "adjustment") {
      delta = values.quantity;
      source = "Inventory adjustment";
      destination = product.warehouseId === "wh_main" ? "Main warehouse" : "Store front";
    }

    const autoRef = `ADJ-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;

    const movement: StockMovement = {
      id: `mov_${crypto.randomUUID().slice(0, 8)}`,
      productId: product.id,
      productName: product.name,
      type: values.type,
      quantityDelta: delta,
      sourceLocation: source,
      destinationLocation: destination,
      reference: values.reference?.trim() || autoRef,
      date: new Date().toISOString(),
      user: "Demo User",
      status: "completed",
      notes: values.notes?.trim() || undefined,
    };

    onSubmit(movement);
    onOpenChange(false);
  }

  const adjustmentHelper =
    isAdjustment && currentProduct
      ? `Enter positive to add, negative to remove. Current stock: ${currentProduct.stockQuantity}.`
      : currentProduct
        ? `Current stock: ${currentProduct.stockQuantity} ${currentProduct.unit}.`
        : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Adjust stock</DialogTitle>
          <DialogDescription>
            Record a stock movement. The product&apos;s quantity updates immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productId">Product *</Label>
            <Select id="productId" {...register("productId")} aria-invalid={!!errors.productId}>
              <option value="">Select a product…</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku})
                </option>
              ))}
            </Select>
            {errors.productId && <p className="text-xs text-danger">{errors.productId.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Movement type *</Label>
              <Select id="type" {...register("type")}>
                {ADJUSTABLE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">
                Quantity {isAdjustment ? "(signed)" : ""} *
              </Label>
              <Input
                id="quantity"
                type="number"
                step="1"
                {...register("quantity")}
                aria-invalid={!!errors.quantity}
              />
              {errors.quantity && <p className="text-xs text-danger">{errors.quantity.message}</p>}
            </div>
          </div>

          {adjustmentHelper && <p className="text-xs text-muted">{adjustmentHelper}</p>}

          <div className="space-y-2">
            <Label htmlFor="reference">Reference</Label>
            <Input id="reference" placeholder="Auto-generated if blank" {...register("reference")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" rows={2} placeholder="Optional" {...register("notes")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Record movement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}