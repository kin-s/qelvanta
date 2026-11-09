"use client";

import { useSyncExternalStore } from "react";
import type { OnboardingData } from "./types";

const KEY = "bizflow:onboarding:v1";

export const defaultData: OnboardingData = {
  currentStep: 0,
  completed: false,

  businessName: "",
  businessType: "",
  industry: "",
  description: "",
  country: "",
  businessEmail: "",
  phone: "",
  website: "",

  baseCurrency: "USD",
  timezone: "UTC",
  language: "en",
  dateFormat: "MM/DD/YYYY",
  numberFormat: "1,234.56",

  structure: "",

  modules: ["inventory", "sales", "finance"],

  invites: [],
};

type Listener = () => void;
const listeners = new Set<Listener>();

let cached: OnboardingData | null = null;

function readFromStorage(): OnboardingData {
  if (typeof window === "undefined") return defaultData;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultData;
    return { ...defaultData, ...JSON.parse(raw) } as OnboardingData;
  } catch {
    return defaultData;
  }
}

function getSnapshot(): OnboardingData {
  if (cached === null) cached = readFromStorage();
  return cached;
}

function getServerSnapshot(): OnboardingData {
  return defaultData;
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emit() {
  for (const l of listeners) l();
}

export function useOnboardingData(): OnboardingData {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function updateOnboarding(partial: Partial<OnboardingData>) {
  const next = { ...getSnapshot(), ...partial };
  cached = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }
  emit();
}

export function resetOnboarding() {
  cached = defaultData;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  }
  emit();
}

// Cross-tab sync (nice-to-have)
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      cached = null;
      emit();
    }
  });
}