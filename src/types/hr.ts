export type EmploymentStatus = "active" | "inactive" | "on_leave";
export type AttendanceStatus = "present" | "late" | "absent" | "half_day";
export type LeaveType = "annual" | "sick" | "unpaid" | "maternity" | "paternity" | "other";
export type LeaveStatus = "pending" | "approved" | "rejected";

export interface Employee {
  id: string;
  empId: string; // e.g. EMP-001
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  branch: string;
  employmentDate: string;
  status: EmploymentStatus;
  salary: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: AttendanceStatus;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
}

export const DEPARTMENTS = [
  "Sales", "Finance", "Operations", "HR", "IT", "Marketing", "Inventory", "Management"
] as const;

export const BRANCHES = [
  "Main HQ", "Store Front", "Warehouse", "Remote"
] as const;

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  annual: "Annual Leave",
  sick: "Sick Leave",
  unpaid: "Unpaid Leave",
  maternity: "Maternity",
  paternity: "Paternity",
  other: "Other",
};

export const ATTENDANCE_STATUS_VARIANTS = {
  present: "success",
  late: "warning",
  absent: "danger",
  half_day: "info",
} as const;