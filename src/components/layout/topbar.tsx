"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import {
  Menu, Search, Bell, LogOut, User as UserIcon, Settings, HelpCircle, Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, useLogout } from "@/hooks/use-session";
import { flatNavItems } from "@/config/nav";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard", sales: "Sales & POS", inventory: "Inventory",
  customers: "Customers", suppliers: "Suppliers", purchases: "Purchases",
  finance: "Finance", invoices: "Invoices", employees: "Employees",
  branches: "Branches", warehouses: "Warehouses", reports: "Reports",
  "ai-assistant": "AI Assistant", automations: "Automations",
  notifications: "Notifications", settings: "Settings",
};

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    label: LABELS[seg] ?? seg,
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted hover:bg-card hover:text-foreground lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        <ol className="flex items-center gap-1.5 text-sm">
          {crumbs.length === 0 ? (
            <li className="text-muted">App</li>
          ) : (
            crumbs.map((c) => (
              <li key={c.href} className="flex items-center gap-1.5">
                {c.isLast ? (
                  <span className="font-medium text-foreground">{c.label}</span>
                ) : (
                  <>
                    <Link
                      href={c.href}
                      className="text-muted hover:text-foreground transition-colors"
                    >
                      {c.label}
                    </Link>
                    <span className="text-muted/50">/</span>
                  </>
                )}
              </li>
            ))
          )}
        </ol>
      </nav>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
          }}
          className="hidden h-9 items-center gap-2 rounded-md border border-border bg-surface px-2.5 text-xs text-muted transition-colors hover:bg-card hover:text-foreground sm:inline-flex"
          aria-label="Search the app (Ctrl+K)"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search…</span>
          <kbd className="ml-2 rounded border border-border bg-background px-1 text-[10px] text-muted">
            Ctrl K
          </kbd>
        </button>

        <ThemeToggleButton />
        <NotificationsButton />
        <UserMenu />
      </div>
    </header>
  );
}

function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme">
        <Moon />
      </Button>
    );
  }

  const next = theme === "dark" ? "light" : "dark";
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
    >
      <Moon />
    </Button>
  );
}

function NotificationsButton() {
  return (
    <Button asChild variant="ghost" size="icon" className="relative" aria-label="View notifications">
      <Link href="/notifications">
        <Bell />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
      </Link>
    </Button>
  );
}

function UserMenu() {
  const router = useRouter();
  const { user, isDemo } = useSession();
  const logout = useLogout();
  const mounted = useMounted();

  const initials = mounted
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AK";

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-[#111111] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Open user menu"
        >
          {initials}
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{mounted ? user.name : "User"}</span>
            <span className="text-xs text-muted">{mounted ? user.email : ""}</span>
            {mounted && isDemo && (
              <Badge variant="warning" className="mt-1 w-fit">
                Demo mode
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="w-full cursor-pointer flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="w-full cursor-pointer flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/help" className="w-full cursor-pointer flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Help
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-danger [&_svg]:text-danger">
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { flatNavItems };