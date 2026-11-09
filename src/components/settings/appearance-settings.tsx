"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Moon, Sun, Monitor, Layout } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const { collapsed, toggle } = useSidebar();

  if (!mounted) return <div className="h-40 animate-pulse rounded bg-surface" />;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="font-heading text-lg font-semibold">Appearance</h2>
        <p className="text-sm text-muted">Customize how BIZFLOW looks and feels on this device.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Theme Preference</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { id: "light", label: "Light", icon: Sun },
            { id: "dark", label: "Dark", icon: Moon },
            { id: "system", label: "System", icon: Monitor },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 transition-colors",
                theme === t.id ? "border-accent bg-accent/5" : "border-border bg-card hover:border-accent/40"
              )}
            >
              <t.icon className={cn("h-6 w-6", theme === t.id ? "text-accent" : "text-muted")} />
              <span className="text-sm font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-sm font-medium">Layout</h3>
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <Layout className="h-5 w-5 text-muted" />
            <div>
              <p className="text-sm font-medium">Collapse Sidebar</p>
              <p className="text-xs text-muted">Show icons only when navigating.</p>
            </div>
          </div>
          <button
            onClick={toggle}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              collapsed ? "bg-accent text-[#111111]" : "bg-surface text-foreground border border-border"
            )}
          >
            {collapsed ? "Collapsed" : "Expanded"}
          </button>
        </div>
      </div>
    </div>
  );
}