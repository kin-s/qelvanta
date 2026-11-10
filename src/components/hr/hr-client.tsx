"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import { SEED_ATTENDANCE, SEED_LEAVE } from "@/data/hr";
import type { Employee, AttendanceRecord, LeaveRequest } from "@/types/hr";
import { HrOverview } from "./hr-overview";
import { EmployeeTable } from "./employee-table";
import { EmployeeForm } from "./employee-form";
import { EmployeeDetailSheet } from "./employee-detail-sheet";
import { AttendanceTab } from "./attendance-tab";
import { LeaveTab } from "./leave-tab";
import { PayrollTab } from "./payroll-tab";
import { createEmployee } from "@/actions/hr";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Tab = "overview" | "directory" | "attendance" | "leave" | "payroll";

export function HrClient({ initialEmployees }: { initialEmployees: Employee[] }) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  // Attendance and Leave still mocked locally for now
  const [attendance] = useLocalStorageState<AttendanceRecord[]>("bizflow:attendance", SEED_ATTENDANCE);
  const [leave] = useLocalStorageState<LeaveRequest[]>("bizflow:leave", SEED_LEAVE);
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("overview");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [viewing, setViewing] = useState<Employee | null>(null);

  function openAdd() { setEditing(null); setFormOpen(true); }
  function openEdit(e: Employee) { setEditing(e); setFormOpen(true); setViewing(null); }

  async function submitEmployee(emp: Employee) {
    if (emp.id) {
      toast.error("Editing coming soon");
      return;
    }
    const res = await createEmployee(emp);
    if (res.error) return toast.error(res.error);
    
    setEmployees([emp, ...employees]);
    toast.success("Employee saved to database");
    setFormOpen(false);
    router.refresh();
  }

  function deleteEmployee() { toast.error("Deletion coming soon"); }
  function clockIn() { toast.error("Attendance coming soon"); }
  function clockOut() { toast.error("Attendance coming soon"); }
  function updateLeave() { toast.error("Leave management coming soon"); }

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "directory" as const, label: "Directory", count: employees.length },
    { id: "attendance" as const, label: "Attendance" },
    { id: "leave" as const, label: "Leave", count: leave.filter(l => l.status === "pending").length },
    { id: "payroll" as const, label: "Payroll" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">Employees & HR</h1>
          <p className="mt-1 text-sm text-muted">
            Manage staff, attendance, and payroll.{" "}
            <span className="text-xs text-success">Directory connected to PostgreSQL.</span>
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus /> Add Employee
        </Button>
      </div>

      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              tab === t.id ? "border-accent text-foreground" : "border-transparent text-muted hover:text-foreground"
            )}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className={cn("ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]", t.id === "leave" ? "bg-warning/20 text-warning" : "bg-surface text-muted")}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "overview" && <HrOverview employees={employees} leave={leave} />}
      {tab === "directory" && (
        <EmployeeTable employees={employees} onView={setViewing} onEdit={openEdit} onDelete={deleteEmployee} />
      )}
      {tab === "attendance" && (
        <AttendanceTab employees={employees} attendance={attendance} onClockIn={clockIn} onClockOut={clockOut} />
      )}
      {tab === "leave" && <LeaveTab leave={leave} employees={employees} onUpdateStatus={updateLeave} />}
      {tab === "payroll" && <PayrollTab employees={employees} />}

      <EmployeeForm
        open={formOpen}
        onOpenChange={(o) => { setFormOpen(o); if (!o) setEditing(null); }}
        employee={editing}
        onSubmit={submitEmployee}
      />

      <EmployeeDetailSheet
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
        employee={viewing}
        attendance={attendance}
        leave={leave}
        onEdit={openEdit}
        onDelete={deleteEmployee}
      />
    </div>
  );
}