"use client";

import { useState, useMemo } from "react";
import { Bell, CheckCircle2, Circle, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import { SEED_NOTIFICATIONS } from "@/data/automations";
import { NOTIFICATION_LABELS, type Notification, type NotificationType } from "@/types/automations";
import { formatDate, cn } from "@/lib/utils";

export function NotificationsClient() {
  const [notifications, setNotifications] = useLocalStorageState<Notification[]>("bizflow:notifications", SEED_NOTIFICATIONS);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<NotificationType | "">("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return notifications.filter(n => {
      if (q && !n.title.toLowerCase().includes(q) && !n.message.toLowerCase().includes(q)) return false;
      if (filterType && n.type !== filterType) return false;
      return true;
    }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [notifications, search, filterType]);

  const unreadCount = notifications.filter(n => !n.read).length;

  function markAllRead() {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  }

  function toggleRead(id: string) {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: !n.read } : n));
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl flex items-center gap-2">
            <Bell className="h-6 w-6 text-accent" />
            Notifications
          </h1>
          <p className="mt-1 text-sm text-muted">
            You have <span className="font-medium text-accent">{unreadCount}</span> unread messages.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" onClick={markAllRead}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notifications..." className="pl-9" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilterType("")} className={cn("px-3 py-1.5 text-xs font-medium rounded-md border transition-colors", filterType === "" ? "bg-accent text-[#111111] border-accent" : "bg-surface text-muted border-border hover:text-foreground")}>All</button>
          {(Object.keys(NOTIFICATION_LABELS) as NotificationType[]).map(t => (
            <button key={t} onClick={() => setFilterType(t)} className={cn("px-3 py-1.5 text-xs font-medium rounded-md border transition-colors", filterType === t ? "bg-accent text-[#111111] border-accent" : "bg-surface text-muted border-border hover:text-foreground")}>
              {NOTIFICATION_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-muted">No notifications found.</div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map(n => (
              <div
                key={n.id}
                className={cn(
                  "p-4 flex gap-3 transition-colors hover:bg-surface/50 cursor-pointer",
                  !n.read ? "bg-accent/5" : ""
                )}
                onClick={() => toggleRead(n.id)}
              >
                <button className="mt-1 shrink-0 focus:outline-none" aria-label="Toggle read status">
                  {n.read ? <Circle className="h-4 w-4 text-muted/30" /> : <div className="h-4 w-4 rounded-full bg-accent shadow-[0_0_0_3px_rgba(198,166,107,0.2)]" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm font-medium", n.read ? "text-muted" : "text-foreground")}>
                      {n.title}
                    </p>
                    <span className="text-[10px] text-muted whitespace-nowrap">
                      {formatDate(n.createdAt, "en-US", { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={cn("text-sm mt-0.5", n.read ? "text-muted/70" : "text-muted")}>
                    {n.message}
                  </p>
                  <Badge variant="outline" className="mt-2 text-[10px]">
                    {NOTIFICATION_LABELS[n.type]}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}