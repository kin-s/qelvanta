import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import { compare } from "bcrypt-ts"
import authConfig from "@/auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET, // <-- Explicitly pass the secret here too
  providers: authConfig.providers.map(provider => {
    if (provider.type === "credentials") {
      return {
        ...provider,
        async authorize(credentials) {
          try {
            if (!credentials?.email || !credentials?.password) return null
            
            const user = await prisma.user.findUnique({
              where: { email: credentials.email as string }
            })
            
            if (!user || !user.passwordHash) return null
            
            const isValid = await compare(credentials.password as string, user.passwordHash)
            
            if (!isValid) return null
            
            return { id: user.id, name: user.name, email: user.email }
          } catch (error) {
            console.error("Authorize error:", error)
            return null
          }
        }
      }
    }
    return provider
  }),
})