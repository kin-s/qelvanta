"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentOrgId } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"
import type { Employee } from "@/types/hr"

export async function getEmployees() {
  try {
    const orgId = await getCurrentOrgId()
    const employees = await prisma.employee.findMany({
      where: { organizationId: orgId },
      orderBy: { name: "asc" }
    })

    const mapped: Employee[] = employees.map(e => ({
      id: e.id,
      empId: e.id.slice(0, 8).toUpperCase(), // Mock employee ID format
      name: e.name,
      email: e.email || "",
      phone: e.phone || "",
      department: e.department,
      position: e.position,
      branch: e.branchId || "Main HQ", // Simplified for now
      employmentDate: e.createdAt.toISOString(),
      status: e.status as any,
      salary: e.salary,
    }))

    return { employees: mapped }
  } catch (error) {
    return { error: "Failed to load employees." }
  }
}

export async function createEmployee(data: Employee) {
  try {
    const orgId = await getCurrentOrgId()
    await prisma.employee.create({
      data: {
        organizationId: orgId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        department: data.department,
        position: data.position,
        salary: data.salary,
        status: data.status,
      }
    })
    revalidatePath("/employees")
    return { success: true }
  } catch (error) {
    return { error: "Failed to create employee." }
  }
}