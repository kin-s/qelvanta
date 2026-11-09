import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { moduleStubs, type ModuleKey } from "@/config/modules";

export function ModulePlaceholder({ moduleKey }: { moduleKey: ModuleKey }) {
  const stub = moduleStubs[moduleKey];
  const Icon = stub.icon;

  return (
    <div>
      <div className="mb-8">
        <div className="mb-3">
          <Badge variant="warning">
            <Clock className="h-3 w-3" />
            Ships in {stub.phase}
          </Badge>
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          {stub.title}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">{stub.description}</p>
      </div>

      <Card className="border-dashed p-10 text-center sm:p-16">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Icon className="h-8 w-8" />
        </div>
        <h2 className="font-heading text-lg font-semibold">
          This module ships in {stub.phase}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          The shell, navigation, and permissions are ready. The full module
          interface arrives in {stub.phase}.
        </p>
        <div className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-2">
          {stub.features.map((f) => (
            <span
              key={f}
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted"
            >
              {f}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}