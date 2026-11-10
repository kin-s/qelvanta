import Credentials from "next-auth/providers/credentials"

// Explicit validation to catch missing secrets during Edge init
if (!process.env.AUTH_SECRET) {
  throw new Error("AUTH_SECRET is missing from environment variables");
}

const config = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: () => null,
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: { strategy: "jwt" as const },
  trustHost: true,
}

export default config;