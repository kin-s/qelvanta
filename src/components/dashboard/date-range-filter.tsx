"use client";

import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DateRange } from "@/types/dashboard";

const OPTIONS: { value: DateRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "last7", label: "7 days" },
  { value: "last30", label: "30 days" },
  { value: "last90", label: "90 days" },
  { value: "thisYear", label: "This year" },
];

export function DateRangeFilter({
  value,
  onChange,
}: {
  value: DateRange;
  onChange: (v: DateRange) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Date range"
      className="inline-flex items-center gap-1 overflow-x-auto rounded-md border border-border bg-surface p-1"
    >
      <Calendar className="ml-2 h-3.5 w-3.5 shrink-0 text-muted" aria-hidden />
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "shrink-0 rounded-sm px-2.5 py-1 text-xs font-medium transition-colors",
            value === opt.value
              ? "bg-accent text-[#111111]"
              : "text-muted hover:text-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}