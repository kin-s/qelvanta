export function DemoNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-md border border-border bg-surface/60 p-3 text-xs leading-relaxed text-muted">
      <span className="font-semibold text-foreground">Security Notice:</span>{" "}
      {children}
    </div>
  );
}