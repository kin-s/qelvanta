import { cn } from "@/lib/utils";

export function Progress({ current, total }: { current: number; total: number }) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-2 flex items-center justify-between text-xs text-muted">
        <span>
          Step <span className="font-medium text-foreground">{current}</span> of {total}
        </span>
        <span>{Math.round((current / total) * 100)}% complete</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i < current ? "bg-accent" : "bg-border"
            )}
          />
        ))}
      </div>
    </div>
  );
}