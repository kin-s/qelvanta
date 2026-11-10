"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentOrgId } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"

export async function updateOrganization(data: { name: string; currency: string }) {
  try {
    const orgId = await getCurrentOrgId()
    await prisma.organization.update({
      where: { id: orgId },
      data: {
        name: data.name,
        currency: data.currency,
      }
    })
    revalidatePath("/settings")
    return { success: true }
  } catch (error) {
    return { error: "Failed to update settings." }
  }
}