"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronsLeft, ChevronsRight, Plus, Check, ChevronsUpDown, Building2,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/shared/logo";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navSections, hasPermission } from "@/config/nav";
import { useSession } from "@/hooks/use-session";
import { useSidebar } from "@/hooks/use-sidebar";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";

interface Workspace {
  id: string;
  name: string;
  plan: string;
  initials: string;
}

const WORKSPACES: Workspace[] = [
  { id: "primary", name: "My Workspace", plan: "Growth", initials: "MW" },
  { id: "demo", name: "Demo Trading Co.", plan: "Starter", initials: "DT" },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();
  const { user } = useSession();
  const [activeWorkspaceId, setActiveWorkspaceId] = useLocalStorageState<string>(
    "bizflow:active-workspace",
    "primary"
  );
  const activeWorkspace =
    WORKSPACES.find((w) => w.id === activeWorkspaceId) ?? WORKSPACES[0];

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-surface transition-[width] duration-200",
        collapsed ? "w-16" : "w-60",
        className
      )}
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
        <Link href="/dashboard" className="min-w-0">
          {collapsed ? <Logo size="sm" showWordmark={false} /> : <Logo size="md" />}
        </Link>
      </div>

      <div className="shrink-0 p-2">
        <WorkspaceSwitcher
          collapsed={collapsed}
          active={activeWorkspace}
          workspaces={WORKSPACES}
          onSwitch={setActiveWorkspaceId}
        />
      </div>

      {/* Added pr-1 here to prevent the scrollbar from overlapping the icons */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 pr-1" aria-label="Main navigation">
        <div className="space-y-4">
          {navSections.map((section) => {
            const visible = section.items.filter((i) => hasPermission(i.permission));
            if (visible.length === 0) return null;
            return (
              <div key={section.label}>
                {!collapsed && (
                  <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
                    {section.label}
                  </p>
                )}
                <ul className="space-y-0.5">
                  {visible.map((item) => (
                    <li key={item.href}>
                      <SidebarItem
                        item={item}
                        active={
                          pathname === item.href ||
                          (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"))
                        }
                        collapsed={collapsed}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </nav>

      <div className="shrink-0 border-t border-border p-2">
        <div className={cn("flex items-center gap-2", collapsed ? "flex-col" : "justify-between")}>
          <UserCard collapsed={collapsed} name={user.name} email={user.email} />
          <button
            type="button"
            onClick={toggle}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-card hover:text-foreground"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({
  item,
  active,
  collapsed,
}: {
  item: { label: string; href: string; icon: React.ComponentType<{ className?: string }> };
  active: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;
  const content = (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
        active
          ? "bg-accent/15 text-foreground"
          : "text-muted hover:bg-card hover:text-foreground",
        collapsed && "justify-center px-0"
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", active && "text-accent")} />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );

  if (!collapsed) return content;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}

function WorkspaceSwitcher({
  collapsed,
  active,
  workspaces,
  onSwitch,
}: {
  collapsed: boolean;
  active: Workspace;
  workspaces: Workspace[];
  onSwitch: (id: string) => void;
}) {
  const trigger = (
    <DropdownMenuTrigger asChild>
      <button
        type="button"
        className={cn(
          "flex w-full items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-surface",
          collapsed && "justify-center px-0 py-2"
        )}
        aria-label="Switch workspace"
      >
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent/15 text-[10px] font-semibold text-accent">
          {active.initials}
        </div>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-medium">{active.name}</div>
              <div className="truncate text-[10px] text-muted">{active.plan}</div>
            </div>
            <ChevronsUpDown className="h-3 w-3 shrink-0 text-muted" />
          </>
        )}
      </button>
    </DropdownMenuTrigger>
  );

  return (
    <DropdownMenu>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{trigger}</TooltipTrigger>
          <TooltipContent side="right">{active.name}</TooltipContent>
        </Tooltip>
      ) : (
        trigger
      )}
      
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces.map((w) => (
          <DropdownMenuItem key={w.id} onSelect={() => onSwitch(w.id)}>
            <div className="flex h-5 w-5 items-center justify-center rounded bg-accent/15 text-[9px] font-semibold text-accent">
              {w.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm">{w.name}</div>
              <div className="truncate text-[10px] text-muted">{w.plan} plan</div>
            </div>
            {w.id === active.id && <Check className="h-3.5 w-3.5 text-accent" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => toast("Workspace creation is simulated in demo")}>
          <Plus className="h-4 w-4" />
          Create workspace
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="w-full cursor-pointer flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Manage workspaces
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserCard({ collapsed, name, email }: { collapsed: boolean; name: string; email: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-[#111111]">
            {initials}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="text-xs">
            <div className="font-medium">{name}</div>
            <div className="text-muted">{email}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-[#111111]">
        {initials}
      </div>
      <div className="min-w-0">
        <div className="truncate text-xs font-medium">{name}</div>
        <div className="truncate text-[10px] text-muted">{email}</div>
      </div>
    </div>
  );
}