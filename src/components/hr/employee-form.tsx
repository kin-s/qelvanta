"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DEPARTMENTS, BRANCHES, type Employee } from "@/types/hr";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  department: z.string().min(1, "Department required"),
  position: z.string().min(2, "Position required"),
  branch: z.string().min(1, "Branch required"),
  employmentDate: z.string().min(1, "Date required"),
  status: z.enum(["active", "inactive", "on_leave"]),
  salary: z.coerce.number().min(0, "Must be >= 0"),
});

type FormValues = z.infer<typeof schema>;

function generateEmpId(): string {
  return `EMP-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
}

export function EmployeeForm({
  open, onOpenChange, employee, onSubmit
}: {
  open: boolean; onOpenChange: (open: boolean) => void; employee: Employee | null; onSubmit: (e: Employee) => void;
}) {
  const isEdit = !!employee;
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      name: "", email: "", phone: "", department: "Sales", position: "", branch: "Main HQ",
      employmentDate: "", status: "active", salary: 0,
    },
  });

  function handleOpenChange(next: boolean) {
    if (next) {
      reset(employee ? {
        name: employee.name, email: employee.email, phone: employee.phone, department: employee.department,
        position: employee.position, branch: employee.branch, employmentDate: employee.employmentDate.slice(0, 10),
        status: employee.status, salary: employee.salary,
      } : {
        name: "", email: "", phone: "", department: "Sales", position: "", branch: "Main HQ",
        employmentDate: new Date().toISOString().slice(0, 10), status: "active", salary: 0,
      });
    }
    onOpenChange(next);
  }

  function submit(values: FormValues) {
    onSubmit({
      id: employee?.id ?? `emp_${crypto.randomUUID().slice(0, 8)}`,
      empId: employee?.empId ?? generateEmpId(),
      name: values.name,
      email: values.email,
      phone: values.phone ?? "",
      department: values.department,
      position: values.position,
      branch: values.branch,
      employmentDate: new Date(values.employmentDate).toISOString(),
      status: values.status,
      salary: values.salary,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Employee" : "Add Employee"}</DialogTitle>
          <DialogDescription>Manage employee details and role.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2 col-span-2">
              <Label>Full Name *</Label>
              <Input {...register("name")} aria-invalid={!!errors.name} />
              {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" {...register("email")} aria-invalid={!!errors.email} />
              {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input type="tel" {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label>Department *</Label>
              <Select {...register("department")}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Position *</Label>
              <Input {...register("position")} aria-invalid={!!errors.position} />
              {errors.position && <p className="text-xs text-danger">{errors.position.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Branch *</Label>
              <Select {...register("branch")}>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Employment Date *</Label>
              <Input type="date" {...register("employmentDate")} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select {...register("status")}>
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Monthly Base Salary *</Label>
              <Input type="number" step="0.01" {...register("salary")} aria-invalid={!!errors.salary} />
              {errors.salary && <p className="text-xs text-danger">{errors.salary.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{isEdit ? "Save Changes" : "Add Employee"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}