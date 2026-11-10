import NextAuth from "next-auth"
import authConfig from "@/auth.config"

const { handlers } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
})

export const { GET, POST } = handlers
export const runtime = 'edge'