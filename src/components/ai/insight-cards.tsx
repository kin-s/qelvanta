import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { InsightCard } from "@/types/ai";

const VARIANT_STYLES: Record<InsightCard["variant"], { bg: string; border: string; text: string }> = {
  success: { bg: "bg-success/10", border: "border-success/30", text: "text-success" },
  warning: { bg: "bg-warning/10", border: "border-warning/30", text: "text-warning" },
  danger: { bg: "bg-danger/10", border: "border-danger/30", text: "text-danger" },
  info: { bg: "bg-info/10", border: "border-info/30", text: "text-info" },
  accent: { bg: "bg-accent/10", border: "border-accent/30", text: "text-accent" },
};

export function InsightCards({ cards }: { cards: InsightCard[] }) {
  return (
    <div className="space-y-2">
      {cards.map((card) => {
        const style = VARIANT_STYLES[card.variant];
        const TrendIcon =
          card.trend === "up" ? TrendingUp : card.trend === "down" ? TrendingDown : Minus;
        return (
          <div
            key={card.id}
            className={cn(
              "rounded-md border p-3",
              style.bg,
              style.border
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium text-foreground">{card.title}</p>
              <div className={cn("flex items-center gap-1 text-xs font-semibold", style.text)}>
                <TrendIcon className="h-3.5 w-3.5" />
                {card.metric}
              </div>
            </div>
            <p className="mt-1 text-[11px] leading-snug text-muted">{card.description}</p>
          </div>
        );
      })}
    </div>
  );
}

export function InsightSection({
  cards,
  onAskAbout,
}: {
  cards: InsightCard[];
  onAskAbout: (question: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-sm font-semibold">Insights</h2>
          <p className="text-[10px] text-muted">Generated from your mock business data</p>
        </div>
        <Badge variant="warning" className="text-[10px]">
          Demo
        </Badge>
      </div>
      <InsightCards cards={cards} />
      <button
        type="button"
        onClick={() => onAskAbout("Summarize this month's performance.")}
        className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
      >
        Get a full summary
        <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}