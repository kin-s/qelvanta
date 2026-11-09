"use client";

import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import type { Employee } from "@/types/hr";

export function PayrollTab({ employees }: { employees: Employee[] }) {
  const activeEmployees = employees.filter(e => e.status === "active");
  const total = activeEmployees.reduce((s, e) => s + e.salary, 0);

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-gradient-to-br from-accent/5 to-transparent border-accent/20">
        <h3 className="text-sm font-medium text-muted uppercase tracking-wider mb-1">Total Monthly Payroll (Active Staff)</h3>
        <p className="font-heading text-3xl font-semibold tabular text-accent">{formatCurrency(total)}</p>
        <p className="text-xs text-muted mt-2">Note: This does not include tax withholdings, benefits, or overtime.</p>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead className="hidden sm:table-cell">Department</TableHead>
              <TableHead className="text-right">Base Salary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeEmployees.map(e => (
              <TableRow key={e.id}>
                <TableCell>
                  <p className="font-medium">{e.name}</p>
                  <p className="text-xs text-muted">{e.position}</p>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm">{e.department}</TableCell>
                <TableCell className="tabular text-right font-medium">{formatCurrency(e.salary)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}