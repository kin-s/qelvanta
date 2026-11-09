"use client";

import { useLocalStorageState } from "./use-local-storage";

export function useSidebar() {
  const [collapsed, setCollapsed] = useLocalStorageState<boolean>(
    "bizflow:sidebar:collapsed",
    false
  );

  return {
    collapsed,
    toggle: () => setCollapsed(!collapsed),
  };
}