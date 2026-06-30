import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/features/auth/authSlice";

export function usePermission(permission: string): boolean {
  const currentUser = useAppSelector(selectCurrentUser);
  const permissions: string[] = currentUser?.permissions ?? [];
  return permissions.includes(permission);
}

export function usePermissions(permissions: readonly string[]): Record<string, boolean> {
  const currentUser = useAppSelector(selectCurrentUser);
  const userPermissions: string[] = currentUser?.permissions ?? [];
  return Object.fromEntries(
    permissions.map((p) => [p, userPermissions.includes(p)])
  );
}
