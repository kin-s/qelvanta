"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { LEAVE_TYPE_LABELS, type LeaveRequest, type Employee } from "@/types/hr";

export function LeaveTab({
  leave, employees, onUpdateStatus
}: {
  leave: LeaveRequest[]; employees: Employee[]; onUpdateStatus: (id: string, status: "approved" | "rejected") => void;
}) {
  const sorted = [...leave].sort((a, b) => b.startDate.localeCompare(a.startDate));

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="hidden sm:table-cell">Dates</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map(l => {
            const emp = employees.find(e => e.id === l.employeeId);
            return (
              <TableRow key={l.id}>
                <TableCell>
                  <p className="font-medium">{emp?.name || "Unknown"}</p>
                  <p className="text-[10px] text-muted">{emp?.department}</p>
                </TableCell>
                <TableCell className="text-sm">{LEAVE_TYPE_LABELS[l.type]}</TableCell>
                <TableCell className="hidden sm:table-cell text-xs text-muted">
                  {formatDate(l.startDate)} <br/> to {formatDate(l.endDate)}
                </TableCell>
                <TableCell>
                  <Badge variant={l.status === "approved" ? "success" : l.status === "pending" ? "warning" : "danger"}>
                    {l.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {l.status === "pending" && (
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="outline" className="text-success border-success/30 hover:bg-success/10" onClick={() => onUpdateStatus(l.id, "approved")}>Approve</Button>
                      <Button size="sm" variant="outline" className="text-danger border-danger/30 hover:bg-danger/10" onClick={() => onUpdateStatus(l.id, "rejected")}>Reject</Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}