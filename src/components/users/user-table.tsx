"use client";

import { MoreHorizontal, Mail, Shield, UserX } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Select } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import type { User, Role } from "@/types/users";

export function UserTable({
  users, roles, onUpdateRole, onRemove
}: {
  users: User[]; roles: Role[]; onUpdateRole: (userId: string, roleId: string) => void; onRemove: (userId: string) => void;
}) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Joined</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(u => (
            <TableRow key={u.id}>
              <TableCell>
                <p className="font-medium">{u.name}</p>
                <p className="text-xs text-muted">{u.email}</p>
              </TableCell>
              <TableCell>
                <Select 
                  value={u.roleId} 
                  onChange={(e) => onUpdateRole(u.id, e.target.value)}
                  className="h-8 text-xs max-w-[160px]"
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <Badge variant={u.status === "active" ? "success" : u.status === "invited" ? "warning" : "muted"}>
                  {u.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-xs text-muted">{formatDate(u.createdAt)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{u.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => window.open(`mailto:${u.email}`)}>
                      <Mail /> Email
                    </DropdownMenuItem>
                    {u.status === "invited" && (
                      <DropdownMenuItem>
                        <Shield /> Resend Invite
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onRemove(u.id)} className="text-danger [&_svg]:text-danger">
                      <UserX /> Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}