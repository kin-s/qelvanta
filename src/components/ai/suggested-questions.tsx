import { TrendingUp, Package, AlertTriangle, Wallet, Users, Sparkles } from "lucide-react";
import type { SuggestedQuestion } from "@/types/ai";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  trending: TrendingUp,
  package: Package,
  alert: AlertTriangle,
  wallet: Wallet,
  users: Users,
  sparkles: Sparkles,
};

export function SuggestedQuestions({
  questions,
  onSelect,
  disabled,
}: {
  questions: SuggestedQuestion[];
  onSelect: (text: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      {questions.map((q) => {
        const Icon = ICONS[q.icon] ?? Sparkles;
        return (
          <button
            key={q.id}
            type="button"
            onClick={() => onSelect(q.text)}
            disabled={disabled}
            className="flex w-full items-start gap-2 rounded-md border border-border bg-card p-2.5 text-left transition-colors hover:border-accent/40 hover:bg-accent/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
            <span className="text-xs leading-snug text-foreground">{q.text}</span>
          </button>
        );
      })}
    </div>
  );
}