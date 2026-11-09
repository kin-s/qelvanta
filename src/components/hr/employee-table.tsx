"use client";

import { useState, useMemo } from "react";
import { Search, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Select } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { type Employee } from "@/types/hr";

export function EmployeeTable({
  employees, onView, onEdit, onDelete
}: {
  employees: Employee[]; onView: (e: Employee) => void; onEdit: (e: Employee) => void; onDelete: (e: Employee) => void;
}) {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return employees.filter(e => {
      if (q && !e.name.toLowerCase().includes(q) && !e.email.toLowerCase().includes(q)) return false;
      if (deptFilter && e.department !== deptFilter) return false;
      return true;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [employees, search, deptFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employees..." className="pl-9" />
        </div>
        <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="sm:w-40">
          <option value="">All departments</option>
          <option value="Sales">Sales</option>
          <option value="Finance">Finance</option>
          <option value="Operations">Operations</option>
          <option value="Management">Management</option>
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead className="hidden sm:table-cell">Position</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Start Date</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(e => (
              <TableRow key={e.id}>
                <TableCell>
                  <button onClick={() => onView(e)} className="text-left group">
                    <p className="font-medium group-hover:text-accent transition-colors">{e.name}</p>
                    <p className="text-xs text-muted">{e.email}</p>
                  </button>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm">{e.position}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted">{e.department}</TableCell>
                <TableCell>
                  <Badge variant={e.status === "active" ? "success" : e.status === "on_leave" ? "warning" : "muted"}>
                    {e.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-xs text-muted">{formatDate(e.employmentDate)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{e.name}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onView(e)}><Eye /> View Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(e)}><Pencil /> Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onDelete(e)} className="text-danger [&_svg]:text-danger"><Trash2 /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}