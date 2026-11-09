"use client";

import { useState } from "react";
import { Plus, Search, Inbox, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { toast } from "sonner";
import { brandColors } from "@/design-system/tokens";

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

export default function DesignSystemPage() {
  const [inputValue, setInputValue] = useState("");

  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-12">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Logo size="lg" />
            <p className="mt-2 text-sm text-muted">Design System — Phase 1A</p>
          </div>
          <ThemeToggle />
        </header>

        <Separator />

        <Section title="Colors" description="Official BIZFLOW palette — strategy: gold for key actions only.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {Object.entries(brandColors).map(([name, hex]) => (
              <div key={name} className="rounded-lg border border-border bg-card p-3">
                <div className="h-16 w-full rounded-md border border-border" style={{ background: hex }} />
                <div className="mt-2 text-xs font-medium capitalize text-foreground">{name.replace(/([A-Z])/g, " $1")}</div>
                <div className="tabular text-xs text-muted">{hex}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Typography" description="Manrope for headings, Inter for body.">
          <Card>
            <CardContent className="space-y-3 pt-5">
              <h1 className="font-heading text-4xl font-bold">Display / H1 — Manrope</h1>
              <h2 className="font-heading text-2xl font-semibold">H2 — 24px section heading</h2>
              <h3 className="font-heading text-xl font-semibold">H3 — 20px</h3>
              <h4 className="font-heading text-base font-semibold">H4 — 16px card heading</h4>
              <p className="text-sm text-foreground">Body — Inter 14px. The quick brown fox jumps over the lazy dog.</p>
              <p className="text-xs text-muted">Caption — 12px muted.</p>
              <p className="tabular text-3xl font-semibold">$ 128,450.00</p>
            </CardContent>
          </Card>
        </Section>

        <Section title="Buttons">
          <div className="flex flex-wrap items-center gap-3">
            <Button><Plus />Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large <ArrowRight /></Button>
            <Button size="icon" aria-label="Add"><Plus /></Button>
            <Button disabled>Disabled</Button>
          </div>
        </Section>

        <Section title="Form controls">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="you@bizflow.app" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input id="search" className="pl-9" placeholder="Type to search…" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select id="currency" defaultValue="USD">
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="KES">KES — Kenyan Shilling</option>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Internal description…" />
            </div>
          </div>
        </Section>

        <Section title="Badges">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="muted">Muted</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success">Paid</Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="danger">Overdue</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </Section>

        <Section title="Cards">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="tabular text-3xl font-semibold">$ 128,450.00</p>
                <Badge variant="success" className="mt-2">▲ 12.4%</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Total Expenses</CardTitle></CardHeader>
              <CardContent>
                <p className="tabular text-3xl font-semibold">$ 48,220.10</p>
                <Badge variant="warning" className="mt-2">▲ 4.1%</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Net Profit</CardTitle></CardHeader>
              <CardContent>
                <p className="tabular text-3xl font-semibold text-success">$ 80,229.90</p>
                <Badge variant="success" className="mt-2">▲ 18.7%</Badge>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section title="Table">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">INV-1042</TableCell>
                  <TableCell>Acme Ltd</TableCell>
                  <TableCell><Badge variant="success">Paid</Badge></TableCell>
                  <TableCell className="tabular text-right">$ 4,250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV-1043</TableCell>
                  <TableCell>Globex Inc</TableCell>
                  <TableCell><Badge variant="warning">Pending</Badge></TableCell>
                  <TableCell className="tabular text-right">$ 1,890.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV-1044</TableCell>
                  <TableCell>Initech</TableCell>
                  <TableCell><Badge variant="danger">Overdue</Badge></TableCell>
                  <TableCell className="tabular text-right">$ 12,300.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </Section>

        <Section title="Loading & empty states">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="space-y-3 pt-5">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
            <EmptyState
              icon={<Inbox />}
              title="No records yet"
              description="Products you add will appear here."
              action={<Button size="sm"><Plus />Add product</Button>}
            />
          </div>
        </Section>

        <Section title="Toasts" description="Powered by Sonner.">
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => toast.success("Sale recorded", { description: "INV-1042 · $4,250.00" })}>
              <Check />Success
            </Button>
            <Button variant="secondary" onClick={() => toast.error("Failed to save", { description: "Simulated error" })}>
              Error
            </Button>
            <Button variant="secondary" onClick={() => toast("Simulated action", { description: "This is a demo — no backend yet." })}>
              Default
            </Button>
          </div>
        </Section>

        <Separator />
        <footer className="text-center text-xs text-muted">
          Phase 1A · Foundation verified. Phase 1B adds Dialog, Dropdown, Tooltip, Radix Select.
        </footer>
      </div>
    </main>
  );
}