import { Users, UserCheck, UserMinus, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Employee, LeaveRequest } from "@/types/hr";

export function HrOverview({ employees, leave }: { employees: Employee[]; leave: LeaveRequest[] }) {
  const total = employees.length;
  const active = employees.filter(e => e.status === "active").length;
  const onLeave = employees.filter(e => e.status === "on_leave").length;
  const pendingLeave = leave.filter(l => l.status === "pending").length;
  const totalPayroll = employees.filter(e => e.status === "active").reduce((s, e) => s + e.salary, 0);

  const cards = [
    { label: "Total Employees", value: total.toString(), icon: Users, hint: "All staff on record." },
    { label: "Active", value: active.toString(), icon: UserCheck, hint: "Currently active employees." },
    { label: "On Leave", value: onLeave.toString(), icon: UserMinus, hint: "Employees currently away.", variant: "warning" as const },
    { label: "Pending Leave", value: pendingLeave.toString(), icon: CalendarDays, hint: "Requests awaiting approval.", variant: "accent" as const },
    { label: "Monthly Payroll", value: formatCurrency(totalPayroll), icon: Users, hint: "Base salaries for active staff." },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">{c.label}</p>
                  <p className="tabular mt-2 font-heading text-2xl font-semibold">{c.value}</p>
                  <p className="mt-1 text-[11px] text-muted">{c.hint}</p>
                </div>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${c.variant === "warning" ? "bg-warning/15 text-warning" : c.variant === "accent" ? "bg-accent/15 text-accent" : "bg-accent/10 text-accent"}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}