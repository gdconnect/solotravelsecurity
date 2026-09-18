"use client";

import { useCallback, useSyncExternalStore } from "react";

let version = 0;
const getVersion = () => version;
const getServerVersion = () => -1;

/**
 * Subscribe to browser-storage-backed state without setState-in-effect.
 *
 * Returns -1 on the server and during hydration, then a counter that
 * increments on every listed window event plus the cross-tab `storage`
 * event. Derive values with `useMemo(() => read(), [version])`; the -1
 * branch keeps server markup identical to the first client render.
 *
 * `events` must be a module-level constant so the subscription is stable.
 */
export function useStorageVersion(events: readonly string[]): number {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const handler = () => {
        version += 1;
        onStoreChange();
      };
      const names = [...events, "storage"];
      for (const name of names) window.addEventListener(name, handler);
      return () => {
        for (const name of names) window.removeEventListener(name, handler);
      };
    },
    [events],
  );
  return useSyncExternalStore(subscribe, getVersion, getServerVersion);
}
