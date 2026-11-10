// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import authConfig from "@/auth.config"

// Create a lightweight Auth.js instance for the Edge runtime
const { handlers } = NextAuth(authConfig)

export const { GET, POST } = handlers
export const runtime = 'edge' // Force Edge runtime