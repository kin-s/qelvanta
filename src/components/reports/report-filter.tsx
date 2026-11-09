"use client";

import { Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { REPORT_LABELS, type ReportRange } from "@/types/reports";
import { cn } from "@/lib/utils";

export function ReportFilter({
  value, onChange, onExport
}: {
  value: ReportRange; onChange: (v: ReportRange) => void; onExport: () => void;
}) {
  const options = Object.entries(REPORT_LABELS) as [ReportRange, string][];

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
      <div className="flex items-center gap-1 overflow-x-auto rounded-md border border-border bg-surface p-1">
        <Calendar className="ml-2 h-4 w-4 shrink-0 text-muted" />
        {options.map(([val, label]) => (
          <button
            key={val}
            onClick={() => onChange(val)}
            className={cn(
              "shrink-0 rounded-sm px-3 py-1.5 text-xs font-medium transition-colors",
              value === val ? "bg-accent text-[#111111]" : "text-muted hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <Button variant="secondary" size="sm" onClick={onExport}>
        <Download className="mr-2 h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
}