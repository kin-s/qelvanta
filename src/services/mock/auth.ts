import type {
  AuthService,
  AuthSession,
  LoginInput,
  RegisterInput,
} from "../interfaces/auth";

const STORAGE_KEY = "bizflow:auth:session";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeSession(email: string, name: string): AuthSession {
  const now = new Date();
  const expires = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7);
  return {
    user: {
      id: `user_${crypto.randomUUID().slice(0, 8)}`,
      name,
      email,
      emailVerified: false,
    },
    token: `demo_${crypto.randomUUID()}`,
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
  };
}

function persist(session: AuthSession) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // localStorage may be disabled — silently ignore in demo
  }
}

export const mockAuthService: AuthService = {
  async login(input: LoginInput) {
    await delay(600);
    if (!input.email || !input.password) {
      throw new Error("Email and password are required");
    }
    const name = input.email
      .split("@")[0]
      .replace(/[._-]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const session = makeSession(input.email, name);
    persist(session);
    return session;
  },

  async register(input: RegisterInput) {
    await delay(700);
    if (!input.name || !input.email || !input.password) {
      throw new Error("All fields are required");
    }
    const session = makeSession(input.email, input.name);
    persist(session);
    return session;
  },

  async logout() {
    await delay(200);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  },

  getSession() {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      return null;
    }
  },

  async forgotPassword(email: string) {
    await delay(600);
    if (!email) throw new Error("Email is required");
  },

  async resetPassword(token: string, newPassword: string) {
    await delay(600);
    if (!token || !newPassword) throw new Error("Token and password are required");
  },

  async verifyEmail(token: string) {
    await delay(600);
    if (!token) throw new Error("Token is required");
  },

  async acceptInvitation(token: string, password: string) {
    await delay(600);
    if (!token || !password) throw new Error("Token and password are required");
    const session = makeSession("invited@bizflow.example", "Invited User");
    persist(session);
    return session;
  },
};