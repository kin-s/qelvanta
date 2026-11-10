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
      <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-xs text-muted">Last updated: {lastUpdated}</p>

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