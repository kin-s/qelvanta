import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StepShell({
  title,
  description,
  children,
  footer,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-2xl", className)}>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description && <p className="mt-2 text-sm text-muted">{description}</p>}
      </div>
      <div className="space-y-6">{children}</div>
      {footer && <div className="mt-10">{footer}</div>}
    </div>
  );
}

export function StepFooter({
  onBack,
  onNext,
  onSkip,
  nextLabel = "Continue",
  backLabel = "Back",
  skipLabel = "Skip for now",
  isSubmitting,
  disableNext,
}: {
  onBack?: () => void;
  onNext: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  backLabel?: string;
  skipLabel?: string;
  isSubmitting?: boolean;
  disableNext?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        {onBack && (
          <Button type="button" variant="ghost" onClick={onBack}>
            <ArrowLeft />
            {backLabel}
          </Button>
        )}
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row">
        {onSkip && (
          <Button type="button" variant="ghost" onClick={onSkip}>
            {skipLabel}
          </Button>
        )}
        <Button type="button" onClick={onNext} disabled={isSubmitting || disableNext}>
          {isSubmitting ? "Saving…" : nextLabel}
          {!isSubmitting && <ArrowRight />}
        </Button>
      </div>
    </div>
  );
}