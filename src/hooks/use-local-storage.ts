"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const EVT = "bizflow:storage";

export function useLocalStorageState<T>(
  key: string,
  defaultValue: T
): [T, (v: T) => void] {
  const subscribe = useCallback(
    (listener: () => void) => {
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) listener();
      };
      const onCustom = (e: Event) => {
        const detail = (e as CustomEvent).detail as { key?: string } | undefined;
        if (detail?.key === key) listener();
      };
      window.addEventListener("storage", onStorage);
      window.addEventListener(EVT, onCustom);
      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(EVT, onCustom);
      };
    },
    [key]
  );

  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }, [key]);

  const getServerSnapshot = useCallback(() => null, []);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = useMemo<T>(() => {
    if (raw === null) return defaultValue;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return defaultValue;
    }
  }, [raw, defaultValue]);

  const setValue = useCallback(
    (v: T) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(v));
      } catch {
        // ignore quota / privacy errors
      }
      window.dispatchEvent(new CustomEvent(EVT, { detail: { key } }));
    },
    [key]
  );

  return [value, setValue];
}