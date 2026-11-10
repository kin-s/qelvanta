import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function proxy(req: any) {
  // Use getToken instead of auth() to avoid Prisma/Adapter in Edge Middleware
  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  const isLoggedIn = !!token
  
  const isDashboardRoute = 
    req.nextUrl.pathname.startsWith('/dashboard') || 
    req.nextUrl.pathname.startsWith('/sales') ||
    req.nextUrl.pathname.startsWith('/inventory') ||
    req.nextUrl.pathname.startsWith('/customers') ||
    req.nextUrl.pathname.startsWith('/suppliers') ||
    req.nextUrl.pathname.startsWith('/purchases') ||
    req.nextUrl.pathname.startsWith('/finance') ||
    req.nextUrl.pathname.startsWith('/invoices') ||
    req.nextUrl.pathname.startsWith('/employees') ||
    req.nextUrl.pathname.startsWith('/branches') ||
    req.nextUrl.pathname.startsWith('/warehouses') ||
    req.nextUrl.pathname.startsWith('/reports') ||
    req.nextUrl.pathname.startsWith('/ai-assistant') ||
    req.nextUrl.pathname.startsWith('/automations') ||
    req.nextUrl.pathname.startsWith('/notifications') ||
    req.nextUrl.pathname.startsWith('/settings')
  
  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}