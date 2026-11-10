"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentOrgId } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"
import type { Branch, Warehouse } from "@/types/operations"

export async function getBranches() {
  try {
    const orgId = await getCurrentOrgId()
    const branches = await prisma.branch.findMany({
      where: { organizationId: orgId },
      orderBy: { name: "asc" }
    })
    
    const mapped: Branch[] = branches.map(b => ({
      id: b.id, name: b.name, code: b.code, address: b.address || "",
      city: b.city || "", country: b.country || "", manager: b.manager || "",
      phone: b.phone || "", status: b.status as any, createdAt: b.createdAt.toISOString()
    }))
    
    return { branches: mapped }
  } catch (error) {
    return { error: "Failed to load branches." }
  }
}

export async function createBranch(data: Branch) {
  try {
    const orgId = await getCurrentOrgId()
    await prisma.branch.create({
      data: {
        organizationId: orgId,
        name: data.name,
        code: data.code,
        address: data.address,
        city: data.city,
        country: data.country,
        manager: data.manager,
        phone: data.phone,
        status: data.status,
      }
    })
    revalidatePath("/branches")
    return { success: true }
  } catch (error) {
    return { error: "Failed to create branch." }
  }
}

export async function getWarehouses() {
  try {
    const orgId = await getCurrentOrgId()
    const warehouses = await prisma.warehouse.findMany({
      where: { organizationId: orgId },
      orderBy: { name: "asc" }
    })

    const mapped: Warehouse[] = warehouses.map(w => ({
      id: w.id, name: w.name, code: w.code, branchId: w.branchId,
      address: w.address || "", manager: w.manager || "", capacity: w.capacity,
      status: w.status as any, createdAt: w.createdAt.toISOString()
    }))

    return { warehouses: mapped }
  } catch (error) {
    return { error: "Failed to load warehouses." }
  }
}

export async function createWarehouse(data: Warehouse) {
  try {
    const orgId = await getCurrentOrgId()
    await prisma.warehouse.create({
      data: {
        organizationId: orgId,
        branchId: data.branchId,
        name: data.name,
        code: data.code,
        address: data.address,
        manager: data.manager,
        capacity: data.capacity,
        status: data.status,
      }
    })
    revalidatePath("/warehouses")
    return { success: true }
  } catch (error) {
    return { error: "Failed to create warehouse." }
  }
}