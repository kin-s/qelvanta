"use client";

import { useState } from "react";
import { ChevronsUpDown, Check, Search, User as UserIcon, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Customer } from "@/types/sales";

export function CustomerPicker({
  customers,
  value,
  onChange,
}: {
  customers: Customer[];
  value: Customer | null;
  onChange: (c: Customer | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = customers.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      (c.email ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 py-2 text-left text-sm transition-colors hover:bg-card"
        >
          <span className="flex min-w-0 items-center gap-2">
            {value?.type === "business" ? (
              <Building2 className="h-3.5 w-3.5 shrink-0 text-muted" />
            ) : (
              <UserIcon className="h-3.5 w-3.5 shrink-0 text-muted" />
            )}
            <span className="truncate">
              {value?.name ?? "Walk-in customer"}
            </span>
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <div className="border-b border-border p-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers…"
              className="h-8 pl-8 text-xs"
              autoFocus
            />
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <p className="p-3 text-center text-xs text-muted">No customers found.</p>
          ) : (
            filtered.map((c) => {
              const active = value?.id === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    onChange(c);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm transition-colors",
                    active ? "bg-accent/10" : "hover:bg-surface"
                  )}
                >
                  {c.type === "business" ? (
                    <Building2 className="h-3.5 w-3.5 shrink-0 text-muted" />
                  ) : (
                    <UserIcon className="h-3.5 w-3.5 shrink-0 text-muted" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-foreground">{c.name}</p>
                    {c.email && <p className="truncate text-[10px] text-muted">{c.email}</p>}
                  </div>
                  {active && <Check className="h-3.5 w-3.5 shrink-0 text-accent" />}
                </button>
              );
            })
          )}
        </div>
        <div className="border-t border-border p-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
          >
            <UserIcon />
            Clear (walk-in)
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}