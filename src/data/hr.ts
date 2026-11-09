import type { Employee, AttendanceRecord, LeaveRequest } from "@/types/hr";

export const SEED_EMPLOYEES: Employee[] = [
  { id: "emp_1", empId: "EMP-001", name: "Amina Kimani", email: "amina@bizflow.example", phone: "+254 700 100200", department: "Management", position: "General Manager", branch: "Main HQ", employmentDate: "2024-01-15T00:00:00Z", status: "active", salary: 5500 },
  { id: "emp_2", empId: "EMP-002", name: "Bob Smith", email: "bob@bizflow.example", phone: "+1 555 0199", department: "Sales", position: "Sales Lead", branch: "Main HQ", employmentDate: "2024-03-01T00:00:00Z", status: "active", salary: 4200 },
  { id: "emp_3", empId: "EMP-003", name: "Sara Chen", email: "sara@bizflow.example", phone: "+65 8123 4567", department: "Finance", position: "Accountant", branch: "Main HQ", employmentDate: "2024-06-10T00:00:00Z", status: "active", salary: 3800 },
  { id: "emp_4", empId: "EMP-004", name: "Wanjiku Mwangi", email: "wanjiku@bizflow.example", phone: "+254 722 334455", department: "Operations", position: "Inventory Manager", branch: "Warehouse", employmentDate: "2025-02-01T00:00:00Z", status: "active", salary: 3500 },
  { id: "emp_5", empId: "EMP-005", name: "Priya Patel", email: "priya@bizflow.example", phone: "+91 98765 43210", department: "Marketing", position: "Marketing Specialist", branch: "Remote", employmentDate: "2025-08-15T00:00:00Z", status: "on_leave", salary: 3200 },
  { id: "emp_6", empId: "EMP-006", name: "Tunde Adeyemi", email: "tunde@bizflow.example", phone: "+234 803 123 4567", department: "Sales", position: "Cashier", branch: "Store Front", employmentDate: "2025-11-01T00:00:00Z", status: "active", salary: 2800 },
  { id: "emp_7", empId: "EMP-007", name: "Elena Rossi", email: "elena@bizflow.example", phone: "+39 333 123 4567", department: "IT", position: "Systems Admin", branch: "Main HQ", employmentDate: "2023-05-20T00:00:00Z", status: "inactive", salary: 4000 },
];

export const SEED_ATTENDANCE: AttendanceRecord[] = [
  { id: "att_1", employeeId: "emp_1", date: "2026-11-06T00:00:00Z", checkIn: "2026-11-06T08:55:00Z", checkOut: null, status: "present" },
  { id: "att_2", employeeId: "emp_2", date: "2026-11-06T00:00:00Z", checkIn: "2026-11-06T09:15:00Z", checkOut: null, status: "late" },
  { id: "att_3", employeeId: "emp_3", date: "2026-11-06T00:00:00Z", checkIn: "2026-11-06T08:45:00Z", checkOut: null, status: "present" },
  { id: "att_4", employeeId: "emp_4", date: "2026-11-06T00:00:00Z", checkIn: null, checkOut: null, status: "absent" },
  { id: "att_5", employeeId: "emp_6", date: "2026-11-06T00:00:00Z", checkIn: "2026-11-06T08:59:00Z", checkOut: null, status: "present" },
];

export const SEED_LEAVE: LeaveRequest[] = [
  { id: "lv_1", employeeId: "emp_5", type: "annual", startDate: "2026-11-01T00:00:00Z", endDate: "2026-11-15T00:00:00Z", reason: "Annual family vacation.", status: "approved" },
  { id: "lv_2", employeeId: "emp_2", type: "sick", startDate: "2026-10-25T00:00:00Z", endDate: "2026-10-26T00:00:00Z", reason: "Flu recovery.", status: "approved" },
  { id: "lv_3", employeeId: "emp_6", type: "annual", startDate: "2026-12-20T00:00:00Z", endDate: "2026-12-27T00:00:00Z", reason: "Holiday travel.", status: "pending" },
  { id: "lv_4", employeeId: "emp_3", type: "other", startDate: "2026-11-10T00:00:00Z", endDate: "2026-11-10T00:00:00Z", reason: "Personal errand.", status: "pending" },
];