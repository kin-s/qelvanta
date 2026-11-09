"use client";

import { useState } from "react";
import { Plus, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import type { Category } from "@/types/inventory";

export function CategoryManager({
  categories,
  productCounts,
  onCreate,
  onDelete,
}: {
  categories: Category[];
  productCounts: Record<string, number>;
  onCreate: (c: Category) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  function add() {
    if (name.trim().length < 2) {
      setError("Category name must be at least 2 characters");
      return;
    }
    const exists = categories.some(
      (c) => c.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (exists) {
      setError("A category with this name already exists");
      return;
    }
    onCreate({
      id: `cat_${Math.random().toString(36).slice(2, 10)}`,
      name: name.trim(),
      description: description.trim() || undefined,
      color: "#C6A66B",
    });
    setName("");
    setDescription("");
    setError("");
    setOpen(false);
    toast.success("Category added");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-semibold">Categories</h2>
          <p className="text-sm text-muted">
            {categories.length} categories · {Object.values(productCounts).reduce((s, v) => s + v, 0)} products
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus />
              New category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add category</DialogTitle>
              <DialogDescription>
                Group products together for faster filtering and reporting.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cat-name">Name *</Label>
                <Input
                  id="cat-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Seasonal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-desc">Description</Label>
                <Input
                  id="cat-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional"
                />
              </div>
              {error && <p className="text-xs text-danger">{error}</p>}
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={add}>Add category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const count = productCounts[c.id] ?? 0;
          return (
            <Card key={c.id}>
              <CardContent className="flex items-start justify-between gap-3 p-5">
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
                    style={{
                      background: (c.color ?? "#C6A66B") + "22",
                      color: c.color ?? "#C6A66B",
                    }}
                  >
                    <Tag className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{c.name}</p>
                    {c.description && (
                      <p className="truncate text-xs text-muted">{c.description}</p>
                    )}
                    <Badge variant="muted" className="mt-1.5">
                      {count} {count === 1 ? "product" : "products"}
                    </Badge>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (count > 0) {
                      toast.error("Cannot delete", {
                        description: "Move products to another category first.",
                      });
                      return;
                    }
                    onDelete(c.id);
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-danger"
                  aria-label={`Delete ${c.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}