"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody, SheetFooter } from "@/components/ui/sheet";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Employee, AttendanceRecord, LeaveRequest } from "@/types/hr";
import { ATTENDANCE_STATUS_VARIANTS, LEAVE_TYPE_LABELS } from "@/types/hr";

export function EmployeeDetailSheet({
  open, onOpenChange, employee, attendance, leave, onEdit, onDelete
}: {
  open: boolean; onOpenChange: (open: boolean) => void; employee: Employee | null;
  attendance: AttendanceRecord[]; leave: LeaveRequest[]; onEdit: (e: Employee) => void; onDelete: (e: Employee) => void;
}) {
  if (!employee) return <Sheet open={open} onOpenChange={onOpenChange}><SheetContent /></Sheet>;

  const myAttendance = attendance.filter(a => a.employeeId === employee.id).sort((a,b) => b.date.localeCompare(a.date));
  const myLeave = leave.filter(l => l.employeeId === employee.id).sort((a,b) => b.startDate.localeCompare(a.startDate));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-border bg-surface/30">
          <div className="flex justify-between items-start">
            <div>
              <SheetTitle className="text-2xl">{employee.name}</SheetTitle>
              <SheetDescription>{employee.position} · {employee.department}</SheetDescription>
              <Badge variant={employee.status === "active" ? "success" : employee.status === "on_leave" ? "warning" : "muted"} className="mt-2">
                {employee.status.replace("_", " ")}
              </Badge>
            </div>
          </div>
        </SheetHeader>

        <SheetBody className="p-6 space-y-8">
          {/* Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-muted text-xs uppercase tracking-wider mb-1">Employee ID</p><p className="font-medium">{employee.empId}</p></div>
            <div><p className="text-muted text-xs uppercase tracking-wider mb-1">Branch</p><p className="font-medium">{employee.branch}</p></div>
            <div><p className="text-muted text-xs uppercase tracking-wider mb-1">Email</p><p className="font-medium break-all">{employee.email}</p></div>
            <div><p className="text-muted text-xs uppercase tracking-wider mb-1">Phone</p><p className="font-medium">{employee.phone || "—"}</p></div>
            <div><p className="text-muted text-xs uppercase tracking-wider mb-1">Salary</p><p className="font-medium tabular">{formatCurrency(employee.salary)}/mo</p></div>
            <div><p className="text-muted text-xs uppercase tracking-wider mb-1">Joined</p><p className="font-medium">{formatDate(employee.employmentDate)}</p></div>
          </div>

          {/* Attendance */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Recent Attendance</h3>
            {myAttendance.length === 0 ? <p className="text-sm text-muted">No records.</p> : (
              <div className="space-y-2">
                {myAttendance.slice(0, 3).map(a => (
                  <div key={a.id} className="flex justify-between items-center p-2 border border-border rounded-md bg-surface/50 text-sm">
                    <span>{formatDate(a.date, "en-US", { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    <span className="text-muted">{a.checkIn ? new Date(a.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "—"} - {a.checkOut ? new Date(a.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "—"}</span>
                    <Badge variant={ATTENDANCE_STATUS_VARIANTS[a.status]}>{a.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leave */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Leave History</h3>
            {myLeave.length === 0 ? <p className="text-sm text-muted">No records.</p> : (
              <div className="space-y-2">
                {myLeave.map(l => (
                  <div key={l.id} className="p-3 border border-border rounded-md bg-surface/50 text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{LEAVE_TYPE_LABELS[l.type]}</span>
                      <Badge variant={l.status === "approved" ? "success" : l.status === "pending" ? "warning" : "danger"}>{l.status}</Badge>
                    </div>
                    <p className="text-xs text-muted">{formatDate(l.startDate)} to {formatDate(l.endDate)}</p>
                    <p className="text-xs mt-1 italic">&ldquo;{l.reason}&rdquo;</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SheetBody>

        <SheetFooter className="border-t border-border p-4">
          <Button variant="ghost" className="flex-1" onClick={() => onEdit(employee)}><Pencil /> Edit</Button>
          <Button variant="ghost" className="flex-1 text-danger [&_svg]:text-danger" onClick={() => onDelete(employee)}><Trash2 /> Delete</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}