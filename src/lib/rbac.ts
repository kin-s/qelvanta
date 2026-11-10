import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * Checks if the current user has one of the allowed roles in their organization.
 * Throws an error if unauthorized.
 */
export async function requireRole(allowedRoles: string[]) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized: Not logged in")

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id }
  })

  if (!membership) throw new Error("Unauthorized: No organization found")
  
  if (!allowedRoles.includes(membership.role)) {
    throw new Error(`Forbidden: Requires one of these roles: ${allowedRoles.join(", ")}`)
  }

  return { userId: session.user.id, orgId: membership.organizationId, role: membership.role }
}