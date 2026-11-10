import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export default {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      // Authorization logic is handled in src/lib/auth.ts
      authorize: () => null,
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: { strategy: "jwt" },
  trustHost: true, // <-- CRITICAL: Trust the Cloudflare host
} satisfies NextAuthConfig