import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * Returns the organization ID of the currently logged-in user.
 * Throws an error if the user is not logged in or has no organization.
 */
export async function getCurrentOrgId() {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id }
  })

  if (!membership) {
    throw new Error("No organization found for this user")
  }

  return membership.organizationId
}