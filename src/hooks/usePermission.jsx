import { useMemo } from "react";
import { config } from "../api/config";

export default function usePermission() {
  const user = useMemo(() => {
    try {
      const stored = localStorage.getItem(config.localStorageUserData);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }, []);

  const hasPermission = (permissionName) => {
    if (!user) return false;
    // Super Admin check (id: 1, name: "Super Admin", email: "superadmin@forsa.com")
    if (
      user.id === 1 ||
      user.name === "Super Admin" ||
      user.email === "superadmin@forsa.com"
    ) {
      return true;
    }
    return user.permissions?.some((p) => p.name === permissionName) || false;
  };

  const hasAnyPermission = (permissionNames) => {
    if (!user) return false;
    if (
      user.id === 1 ||
      user.name === "Super Admin" ||
      user.email === "superadmin@forsa.com"
    ) {
      return true;
    }
    return permissionNames.some((name) =>
      user.permissions?.some((p) => p.name === name),
    );
  };

  return { hasPermission, hasAnyPermission, user };
}
