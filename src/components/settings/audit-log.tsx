import { ShieldCheck } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

const MOCK_LOGS = [
  { id: "1", user: "Amina K.", action: "Updated invoice INV-1045", module: "Invoices", ip: "192.168.1.42", time: "2026-11-06T10:15:00Z" },
  { id: "2", user: "Amina K.", action: "Approved leave request", module: "HR", ip: "192.168.1.42", time: "2026-11-06T09:30:00Z" },
  { id: "3", user: "Bob S.", action: "Completed sale SALE-8857", module: "Sales", ip: "10.0.0.55", time: "2026-11-05T14:30:00Z" },
  { id: "4", user: "System", action: "Daily backup completed", module: "System", ip: "127.0.0.1", time: "2026-11-05T00:00:00Z" },
  { id: "5", user: "Sara C.", action: "Recorded expense (Rent)", module: "Finance", ip: "10.0.0.22", time: "2026-11-01T09:15:00Z" },
];

export function AuditLog() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-muted" /> Recent Audit Log
      </h3>
      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="hidden md:table-cell">Module</TableHead>
              <TableHead className="hidden lg:table-cell">IP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_LOGS.map(log => (
              <TableRow key={log.id}>
                <TableCell className="text-xs text-muted whitespace-nowrap">
                  {formatDate(log.time, "en-US", { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </TableCell>
                <TableCell className="font-medium text-sm">{log.user}</TableCell>
                <TableCell className="text-sm">{log.action}</TableCell>
                <TableCell className="hidden md:table-cell text-xs text-muted">{log.module}</TableCell>
                <TableCell className="hidden lg:table-cell text-xs font-mono text-muted">{log.ip}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}