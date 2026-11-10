// src/lib/auth.ts
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import authConfig from "@/auth.config"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: authConfig.providers.map(provider => {
    // Override the Credentials provider with the real logic
    if (provider.type === "credentials") {
      return {
        ...provider,
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) return null
          
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          })
          
          if (!user || !user.passwordHash) return null
          
          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          )
          
          if (!isValid) return null
          
          return { id: user.id, name: user.name, email: user.email }
        }
      }
    }
    return provider
  }),
})