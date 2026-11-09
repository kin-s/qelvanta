"use client";

import { useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ATTENDANCE_STATUS_VARIANTS, type Employee, type AttendanceRecord } from "@/types/hr";

export function AttendanceTab({
  employees, attendance, onClockIn, onClockOut
}: {
  employees: Employee[]; attendance: AttendanceRecord[]; onClockIn: (empId: string) => void; onClockOut: (recordId: string) => void;
}) {
  const [filter, setFilter] = useState("");
  
  // Today's records
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayRecords = attendance.filter(a => a.date.startsWith(todayStr));

  return (
    <div className="space-y-4">
      <Card className="p-4 flex flex-col sm:flex-row justify-between items-center bg-surface/30">
        <div>
          <h3 className="font-heading font-semibold">Clock In / Out</h3>
          <p className="text-xs text-muted">Quick actions for today&apos;s shift.</p>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <select
            className="h-9 rounded-md border border-border bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
          >
            <option value="">Select employee...</option>
            {employees.filter(e => e.status === "active").map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
          <Button size="sm" onClick={() => { if(filter) { onClockIn(filter); setFilter(""); } }} disabled={!filter}>
            <LogIn className="h-4 w-4 mr-1" /> In
          </Button>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead className="hidden sm:table-cell">Check In</TableHead>
              <TableHead className="hidden sm:table-cell">Check Out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.filter(e => e.status === "active").map(emp => {
              const record = todayRecords.find(r => r.employeeId === emp.id);
              return (
                <TableRow key={emp.id}>
                  <TableCell>
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-xs text-muted">{emp.position}</p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm tabular">
                    {record?.checkIn ? new Date(record.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "—"}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm tabular">
                    {record?.checkOut ? new Date(record.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "—"}
                  </TableCell>
                  <TableCell>
                    {record ? <Badge variant={ATTENDANCE_STATUS_VARIANTS[record.status]}>{record.status}</Badge> : <span className="text-xs text-muted">Not clocked in</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    {record && !record.checkOut && (
                      <Button size="sm" variant="outline" onClick={() => onClockOut(record.id)}>
                        <LogOut className="h-4 w-4 mr-1" /> Out
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}