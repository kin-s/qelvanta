"use client";

import { useSession as useNextAuthSession, signOut } from "next-auth/react";
import { useCallback } from "react";
import type { AuthUser } from "@/services/interfaces/auth";

const DEMO_USER: AuthUser = {
  id: "demo_user",
  name: "Demo User",
  email: "demo@qelvanta.app",
  emailVerified: true,
};

export function useSession() {
  const { data: session, status } = useNextAuthSession();
  
  // Map the NextAuth session to our frontend interface
  const user = session?.user 
    ? {
        id: session.user.id || "unknown",
        name: session.user.name || "User",
        email: session.user.email || "",
        emailVerified: true,
      }
    : DEMO_USER;

  return { 
    session, 
    user, 
    isDemo: !session,
    isLoading: status === "loading"
  };
}

export function useLogout() {
  return useCallback(() => {
    signOut({ callbackUrl: "/login" });
  }, []);
}