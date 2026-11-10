"use server"

import { prisma } from "@/lib/prisma"
import { hash } from "bcrypt-ts" // <-- Changed from bcrypt to bcrypt-ts
import { z } from "zod"
import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function registerUser(formData: z.infer<typeof RegisterSchema>) {
  const validated = RegisterSchema.safeParse(formData)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  const { name, email, password } = validated.data

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return { error: "An account with this email already exists." }
    }

    // Use hash from bcrypt-ts
    const passwordHash = await hash(password, 10)

    await prisma.user.create({
      data: { name, email, passwordHash }
    })

    return { success: "Account created successfully. You can now log in." }
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Something went wrong. Please try again." }
  }
}

export async function loginUser(formData: { email: string; password: string }) {
  try {
    await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." }
        default:
          return { error: "Something went wrong." }
      }
    }
    throw error // NextAuth handles the redirect by throwing an error
  }
}