import { cn } from "@/lib/utils";

export function PageHero({
  overline,
  title,
  description,
  align = "center",
  children,
  className,
}: {
  overline?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden border-b border-border", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(198,166,107,0.10),transparent_70%)]"
      />
      <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:px-8 sm:py-24 lg:py-28">
        {overline && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {overline}
          </p>
        )}
        <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              "mt-5 text-base text-muted sm:text-lg",
              align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
            )}
          >
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}