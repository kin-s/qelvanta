"use client";

import { useMemo, useState } from "react";
import { Search, MoreHorizontal, Pencil, Trash2, Warehouse as WarehouseIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select } from "@/components/ui/select";
import { type Warehouse, type Branch } from "@/types/operations";

export function WarehouseTable({
  warehouses, branches, onEdit, onDelete
}: {
  warehouses: Warehouse[]; branches: Branch[]; onEdit: (w: Warehouse) => void; onDelete: (w: Warehouse) => void;
}) {
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return warehouses.filter(w => {
      if (q && !w.name.toLowerCase().includes(q) && !w.code.toLowerCase().includes(q)) return false;
      if (branchFilter && w.branchId !== branchFilter) return false;
      return true;
    });
  }, [warehouses, search, branchFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search warehouses..." className="pl-9" />
        </div>
        <Select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className="sm:w-48">
          <option value="">All branches</option>
          {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Warehouse</TableHead>
              <TableHead className="hidden sm:table-cell">Branch</TableHead>
              <TableHead className="hidden md:table-cell">Manager</TableHead>
              <TableHead className="text-right">Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(w => {
              const branch = branches.find(b => b.id === w.branchId);
              return (
                <TableRow key={w.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-surface text-muted">
                        <WarehouseIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{w.name}</p>
                        <p className="text-[10px] text-muted font-mono">{w.code}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{branch?.name || "Unknown"}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{w.manager}</TableCell>
                  <TableCell className="tabular text-right">{w.capacity.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={w.status === "active" ? "success" : "muted"}>{w.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(w)}><Pencil /> Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(w)} className="text-danger [&_svg]:text-danger"><Trash2 /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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