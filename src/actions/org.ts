"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createOrganization(data: {
  businessName: string;
  baseCurrency: string;
  timezone: string;
}) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Unauthorized. Please log in again." }
  }

  try {
    // 1. Create the Organization
    const org = await prisma.organization.create({
      data: {
        name: data.businessName || "My Business",
        currency: data.baseCurrency || "USD",
      }
    })

    // 2. Link the User to the Organization as the Owner
    await prisma.membership.create({
      data: {
        userId: session.user.id,
        organizationId: org.id,
        role: "owner"
      }
    })

    // Revalidate the dashboard so it picks up the new org context
    revalidatePath("/dashboard")
    
    return { success: true, orgId: org.id }
  } catch (error) {
    console.error("Organization creation failed:", error)
    return { error: "Failed to create organization. Please try again." }
  }
}