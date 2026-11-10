import Credentials from "next-auth/providers/credentials"

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