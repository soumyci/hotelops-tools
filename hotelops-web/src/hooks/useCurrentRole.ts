// src/hooks/useCurrentRole.ts
import { useEffect, useState } from "react";
import { currentRole, getRoles } from "@/auth";

export function useCurrentRole() {
  const [role, setRole] = useState<string | null>(() => currentRole());

  useEffect(() => {
    const onChange = () => setRole(currentRole());
    window.addEventListener("storage", onChange);
    window.addEventListener("auth:updated", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("auth:updated", onChange);
    };
  }, []);

  // handy if you also need the list
  const roles = getRoles();
  return { role, roles };
}