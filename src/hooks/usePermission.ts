import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/features/auth/authSlice";

export function usePermission(permission: string): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const currentUser = useAppSelector(selectCurrentUser);
  if (!mounted) return false;
  return (currentUser?.permissions ?? []).includes(permission);
}

export function usePermissions(permissions: readonly string[]): Record<string, boolean> {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const currentUser = useAppSelector(selectCurrentUser);
  const userPermissions: string[] = mounted ? (currentUser?.permissions ?? []) : [];
  return Object.fromEntries(
    permissions.map((p) => [p, userPermissions.includes(p)])
  );
}
