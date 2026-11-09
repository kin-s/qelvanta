"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { AuthSession, AuthUser } from "@/services/interfaces/auth";

const KEY = "bizflow:auth:session";
const EVT = "bizflow:auth-change";

const DEMO_USER: AuthUser = {
  id: "demo_user",
  name: "Demo User",
  email: "demo@bizflow.app",
  emailVerified: true,
};

let cachedRaw: string | null | undefined = undefined;
let cachedParsed: AuthSession | null = null;

function getSnapshot(): AuthSession | null {
  if (typeof window === "undefined") return null;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
  if (raw === cachedRaw) return cachedParsed;
  cachedRaw = raw;
  if (!raw) {
    cachedParsed = null;
  } else {
    try {
      cachedParsed = JSON.parse(raw) as AuthSession;
    } catch {
      cachedParsed = null;
    }
  }
  return cachedParsed;
}

function getServerSnapshot(): AuthSession | null {
  return null;
}

function subscribe(listener: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cachedRaw = undefined;
      listener();
    }
  };
  const onCustom = () => {
    cachedRaw = undefined;
    listener();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(EVT, onCustom);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(EVT, onCustom);
  };
}

export function useSession() {
  const session = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const user = useMemo<AuthUser>(() => session?.user ?? DEMO_USER, [session]);
  return { session, user, isDemo: !session };
}

export function notifyAuthChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(EVT));
}

export function useLogout() {
  return useCallback(() => {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
    notifyAuthChange();
  }, []);
}