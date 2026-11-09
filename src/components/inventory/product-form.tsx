"use client";

import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
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
import { SEED_WAREHOUSES } from "@/data/inventory";
import type { Category, Product } from "@/types/inventory";

const schema = z.object({
  name: z.string().min(2, "Enter a product name"),
  sku: z.string().min(2, "SKU is required"),
  barcode: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Choose a category"),
  brand: z.string().optional(),
  purchasePrice: z.coerce.number().min(0, "Must be ≥ 0"),
  sellingPrice: z.coerce.number().min(0, "Must be ≥ 0"),
  taxCategory: z.string().min(1, "Choose a tax category"),
  stockQuantity: z.coerce.number().min(0, "Must be ≥ 0"),
  reorderLevel: z.coerce.number().min(0, "Must be ≥ 0"),
  unit: z.string().min(1, "Choose a unit"),
  warehouseId: z.string().min(1, "Choose a warehouse"),
  status: z.enum(["active", "inactive", "draft"]),
});

type FormValues = z.infer<typeof schema>;

const EMPTY: FormValues = {
  name: "",
  sku: "",
  barcode: "",
  description: "",
  categoryId: "",
  brand: "",
  purchasePrice: 0,
  sellingPrice: 0,
  taxCategory: "standard",
  stockQuantity: 0,
  reorderLevel: 0,
  unit: "pcs",
  warehouseId: "wh_main",
  status: "active",
};

export function ProductForm({
  open,
  onOpenChange,
  product,
  categories,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  categories: Category[];
  onSubmit: (p: Product) => void;
}) {
  const isEdit = !!product;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (open) {
      if (product) {
        reset({
          name: product.name,
          sku: product.sku,
          barcode: product.barcode,
          description: product.description,
          categoryId: product.categoryId,
          brand: product.brand,
          purchasePrice: product.purchasePrice,
          sellingPrice: product.sellingPrice,
          taxCategory: product.taxCategory,
          stockQuantity: product.stockQuantity,
          reorderLevel: product.reorderLevel,
          unit: product.unit,
          warehouseId: product.warehouseId,
          status: product.status,
        });
      } else {
        reset(EMPTY);
      }
    }
  }, [open, product, reset]);

  function submit(values: FormValues) {
    const now = new Date().toISOString();
    const next: Product = {
      // Empty id = new product. Parent generates the actual id in its event handler.
      id: product?.id ?? "",
      name: values.name,
      sku: values.sku,
      barcode: values.barcode ?? "",
      description: values.description ?? "",
      categoryId: values.categoryId,
      brand: values.brand ?? "",
      purchasePrice: values.purchasePrice,
      sellingPrice: values.sellingPrice,
      taxCategory: values.taxCategory,
      stockQuantity: values.stockQuantity,
      reorderLevel: values.reorderLevel,
      unit: values.unit,
      warehouseId: values.warehouseId,
      status: values.status,
      createdAt: product?.createdAt ?? now,
      updatedAt: now,
    };
    onSubmit(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit product" : "Add product"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the product details. Changes apply immediately in this demo."
              : "Add a new product to your catalogue. You can edit it later."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Product name *</Label>
              <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
              {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input id="sku" {...register("sku")} aria-invalid={!!errors.sku} />
              {errors.sku && <p className="text-xs text-danger">{errors.sku.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input id="barcode" {...register("barcode")} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={2} {...register("description")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Category *</Label>
              <Select id="categoryId" {...register("categoryId")} aria-invalid={!!errors.categoryId}>
                <option value="">Select…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
              {errors.categoryId && <p className="text-xs text-danger">{errors.categoryId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" {...register("brand")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase price *</Label>
              <Input id="purchasePrice" type="number" step="0.01" {...register("purchasePrice")} aria-invalid={!!errors.purchasePrice} />
              {errors.purchasePrice && <p className="text-xs text-danger">{errors.purchasePrice.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Selling price *</Label>
              <Input id="sellingPrice" type="number" step="0.01" {...register("sellingPrice")} aria-invalid={!!errors.sellingPrice} />
              {errors.sellingPrice && <p className="text-xs text-danger">{errors.sellingPrice.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock quantity *</Label>
              <Input id="stockQuantity" type="number" {...register("stockQuantity")} aria-invalid={!!errors.stockQuantity} />
              {errors.stockQuantity && <p className="text-xs text-danger">{errors.stockQuantity.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reorderLevel">Reorder level *</Label>
              <Input id="reorderLevel" type="number" {...register("reorderLevel")} aria-invalid={!!errors.reorderLevel} />
              {errors.reorderLevel && <p className="text-xs text-danger">{errors.reorderLevel.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit of measure</Label>
              <Select id="unit" {...register("unit")}>
                <option value="pcs">Pieces</option>
                <option value="kg">Kilograms</option>
                <option value="l">Liters</option>
                <option value="box">Box</option>
                <option value="pack">Pack</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="warehouseId">Warehouse</Label>
              <Select id="warehouseId" {...register("warehouseId")}>
                {SEED_WAREHOUSES.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxCategory">Tax category</Label>
              <Select id="taxCategory" {...register("taxCategory")}>
                <option value="standard">Standard</option>
                <option value="reduced">Reduced</option>
                <option value="zero">Zero-rated</option>
                <option value="exempt">Exempt</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" {...register("status")}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Add product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}