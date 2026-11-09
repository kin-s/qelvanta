import { AlertTriangle } from "lucide-react";

export function LegalPage({
  title,
  lastUpdated,
  sections,
}: {
  title: string;
  lastUpdated: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-20 sm:px-8 lg:py-24">
      <div className="mb-8 flex items-start gap-3 rounded-md border border-warning/40 bg-warning/10 p-4 text-sm">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <div>
          <p className="font-medium text-warning">Placeholder document</p>
          <p className="mt-1 text-muted">
            This page is a placeholder during frontend development. It is not a
            final legal document and must be replaced with a reviewed version
            before launch.
          </p>
        </div>
      </div>

      <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-xs text-muted">Last updated: {lastUpdated} (placeholder)</p>

      <div className="prose-bizflow mt-10 space-y-8">
        {sections.map((section, i) => (
          <section key={i}>
            <h2 className="font-heading text-lg font-semibold">{section.heading}</h2>
            {section.body.map((p, j) => (
              <p key={j} className="mt-2 text-sm text-muted">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>

      <p className="mt-12 border-t border-border pt-6 text-xs text-muted">
        If you have questions, contact{" "}
        <a href="/contact" className="text-accent underline-offset-4 hover:underline">
          our team
        </a>
        .
      </p>
    </article>
  );
}