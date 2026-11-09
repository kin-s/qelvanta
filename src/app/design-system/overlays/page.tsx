"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Pencil, Copy, Trash2, MoreHorizontal, User, Settings,
  LogOut, HelpCircle, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger,
  DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  RichSelect, RichSelectContent, RichSelectItem, RichSelectTrigger, RichSelectValue,
  RichSelectLabel, RichSelectSeparator, RichSelectGroup,
} from "@/components/ui/rich-select";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList, CommandSeparator, CommandShortcut,
} from "@/components/ui/command";
import { toast } from "sonner";

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-heading text-xl font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted">{description}</p>}
      </div>
      <div>{children}</div>
    </section>
  );
}

export default function OverlaysPage() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [role, setRole] = useState("owner");

  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-12">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Logo size="lg" />
            <p className="mt-2 text-sm text-muted">Design System — Phase 1B Overlays</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/design-system"><ArrowLeft />Back</Link>
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <Separator />

        <Section title="Dialog" description="Modal dialogs with focus trap. Esc / backdrop close.">
          <div className="flex flex-wrap gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add new product</DialogTitle>
                  <DialogDescription>
                    This is a demonstration — no data is saved. Real persistence
                    arrives with backend integration.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="dlg-name">Product name</Label>
                    <Input id="dlg-name" placeholder="Wireless keyboard" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dlg-price">Selling price</Label>
                    <Input id="dlg-price" type="number" placeholder="0.00" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="secondary" onClick={() => toast("Demo dialog closed")}>Cancel</Button>
                  <Button onClick={() => toast.success("Product saved (simulated)")}>Save product</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Section>

        <Section title="Alert Dialog" description="Destructive confirmations require explicit action.">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive"><Trash2 />Delete product</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete &ldquo;Wireless keyboard&rdquo;?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the product and all associated stock movement records.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => toast.error("Product deleted (simulated)")}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Section>

        <Section title="Dropdown Menu" description="Action menus, item groups, shortcuts, checkbox & radio items.">
          <div className="flex flex-wrap gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary"><MoreHorizontal />Actions</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Product</DropdownMenuLabel>
                <DropdownMenuItem><Pencil />Edit<DropdownMenuShortcut>⌘E</DropdownMenuShortcut></DropdownMenuItem>
                <DropdownMenuItem><Copy />Duplicate</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-danger [&_svg]:text-danger" onClick={() => toast.error("Delete requires confirmation")}>
                  <Trash2 />Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary">Views</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Show columns</DropdownMenuLabel>
                <DropdownMenuCheckboxItem checked={notifications} onCheckedChange={setNotifications}>
                  Notifications
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={analytics} onCheckedChange={setAnalytics}>
                  Analytics
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary">Role</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Assign role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={role} onValueChange={setRole}>
                  <DropdownMenuRadioItem value="owner">Owner</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="admin">Administrator</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="manager">Manager</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="cashier">Cashier</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="User menu"><User /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem><User />Profile</DropdownMenuItem>
                <DropdownMenuItem><Settings />Settings</DropdownMenuItem>
                <DropdownMenuItem><HelpCircle />Help</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem><LogOut />Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Section>

        <Section title="Tooltip" description="Hover/focus hints. Delay 200ms, keyboard accessible.">
          <div className="flex flex-wrap items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>Tooltip shown above</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Info"><HelpCircle /></Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Works on keyboard focus too</TooltipContent>
            </Tooltip>
          </div>
        </Section>

        <Section title="Popover" description="Anchored floating panels for filters, date pickers, quick info.">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary">Open filter</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="space-y-3">
                <p className="font-heading text-sm font-semibold">Filters</p>
                <div className="space-y-2">
                  <Label htmlFor="pop-status">Status</Label>
                  <Input id="pop-status" placeholder="e.g. Paid, Overdue" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button size="sm" variant="secondary">Reset</Button>
                  <Button size="sm" onClick={() => toast.success("Filters applied (simulated)")}>Apply</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </Section>

        <Section title="Rich Select" description="Radix-powered accessible dropdown with search & groups.">
          <div className="max-w-xs">
            <RichSelect defaultValue="USD">
              <RichSelectTrigger>
                <RichSelectValue placeholder="Select currency" />
              </RichSelectTrigger>
              <RichSelectContent>
                <RichSelectGroup>
                  <RichSelectLabel>Major</RichSelectLabel>
                  <RichSelectItem value="USD">USD — US Dollar</RichSelectItem>
                  <RichSelectItem value="EUR">EUR — Euro</RichSelectItem>
                  <RichSelectItem value="GBP">GBP — British Pound</RichSelectItem>
                </RichSelectGroup>
                <RichSelectSeparator />
                <RichSelectGroup>
                  <RichSelectLabel>Other</RichSelectLabel>
                  <RichSelectItem value="KES">KES — Kenyan Shilling</RichSelectItem>
                  <RichSelectItem value="NGN">NGN — Nigerian Naira</RichSelectItem>
                  <RichSelectItem value="ZAR">ZAR — South African Rand</RichSelectItem>
                </RichSelectGroup>
              </RichSelectContent>
            </RichSelect>
          </div>
        </Section>

        <Section title="Command Palette" description="Base layer for Ctrl+K global search — wired in Phase 4.">
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setCommandOpen(true)}>
              <HelpCircle />Open command palette
            </Button>
            <span className="self-center text-xs text-muted">or press Ctrl/Cmd + K (wired in Phase 4)</span>
          </div>

          <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
            <CommandInput placeholder="Search products, customers, invoices…" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Quick actions">
                <CommandItem onSelect={() => { setCommandOpen(false); toast("Create sale (simulated)"); }}>
                  Create sale<CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
                <CommandItem onSelect={() => { setCommandOpen(false); toast("Add product (simulated)"); }}>
                  Add product
                </CommandItem>
                <CommandItem onSelect={() => { setCommandOpen(false); toast("Create invoice (simulated)"); }}>
                  Create invoice
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Navigation">
                <CommandItem onSelect={() => { setCommandOpen(false); toast("Navigate: Inventory (simulated)"); }}>
                  Go to Inventory
                </CommandItem>
                <CommandItem onSelect={() => { setCommandOpen(false); toast("Navigate: Reports (simulated)"); }}>
                  Go to Reports
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </Section>

        <Section title="Current state (for demo verification)">
          <Card>
            <CardHeader>
              <CardTitle>Live state</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted">Role:</span>
                <Badge variant="accent">{role}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted">Notifications column:</span>
                <Badge variant={notifications ? "success" : "muted"}>{notifications ? "visible" : "hidden"}</Badge>
                {notifications && <Check className="h-4 w-4 text-success" />}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted">Analytics column:</span>
                <Badge variant={analytics ? "success" : "muted"}>{analytics ? "visible" : "hidden"}</Badge>
                {analytics && <Check className="h-4 w-4 text-success" />}
              </div>
            </CardContent>
          </Card>
        </Section>

        <Separator />
        <footer className="text-center text-xs text-muted">
          Phase 1B complete · All overlays accessible (keyboard + ARIA) · Backend not wired
        </footer>
      </div>
    </main>
  );
}