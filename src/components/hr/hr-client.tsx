"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import { SEED_EMPLOYEES, SEED_ATTENDANCE, SEED_LEAVE } from "@/data/hr";
import type { Employee, AttendanceRecord, LeaveRequest } from "@/types/hr";
import { HrOverview } from "./hr-overview";
import { EmployeeTable } from "./employee-table";
import { EmployeeForm } from "./employee-form";
import { EmployeeDetailSheet } from "./employee-detail-sheet";
import { AttendanceTab } from "./attendance-tab";
import { LeaveTab } from "./leave-tab";
import { PayrollTab } from "./payroll-tab";
import { cn } from "@/lib/utils";

type Tab = "overview" | "directory" | "attendance" | "leave" | "payroll";

export function HrClient() {
  const [employees, setEmployees] = useLocalStorageState<Employee[]>("bizflow:employees", SEED_EMPLOYEES);
  const [attendance, setAttendance] = useLocalStorageState<AttendanceRecord[]>("bizflow:attendance", SEED_ATTENDANCE);
  const [leave, setLeave] = useLocalStorageState<LeaveRequest[]>("bizflow:leave", SEED_LEAVE);

  const [tab, setTab] = useState<Tab>("overview");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [viewing, setViewing] = useState<Employee | null>(null);

  function openAdd() { setEditing(null); setFormOpen(true); }
  function openEdit(e: Employee) { setEditing(e); setFormOpen(true); setViewing(null); }

  function submitEmployee(emp: Employee) {
    const exists = employees.some(e => e.id === emp.id);
    if (exists) {
      setEmployees(employees.map(e => e.id === emp.id ? emp : e));
      toast.success("Employee updated");
    } else {
      setEmployees([emp, ...employees]);
      toast.success("Employee added");
    }
    setFormOpen(false);
  }

  function deleteEmployee(emp: Employee) {
    setEmployees(employees.filter(e => e.id !== emp.id));
    setViewing(null);
    toast.success("Employee removed");
  }

  function clockIn(empId: string) {
    const now = new Date().toISOString();
    const todayStr = now.slice(0, 10);
    // Check if already checked in today (even if checked out)
    const existing = attendance.find(a => a.employeeId === empId && a.date.startsWith(todayStr));
    if (existing) {
      toast.error("Already clocked in today.");
      return;
    }
    setAttendance([{
      id: `att_${crypto.randomUUID().slice(0,8)}`,
      employeeId: empId,
      date: now,
      checkIn: now,
      checkOut: null,
      status: new Date(now).getHours() >= 9 ? "late" : "present",
    }, ...attendance]);
    toast.success("Clocked in successfully");
  }

  function clockOut(recordId: string) {
    const now = new Date().toISOString();
    setAttendance(attendance.map(a => a.id === recordId ? { ...a, checkOut: now } : a));
    toast.success("Clocked out successfully");
  }

  function updateLeave(id: string, status: "approved" | "rejected") {
    setLeave(leave.map(l => l.id === id ? { ...l, status } : l));
    toast.success(`Leave request ${status}`);
  }

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
            <span className="text-xs">Demo data — changes persist locally.</span>
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