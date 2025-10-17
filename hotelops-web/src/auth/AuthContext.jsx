// src/auth/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
// we already use these helpers elsewhere
import { getToken, setToken as saveToken, clearToken as wipeToken, getRoles } from "../auth";

// Context shape kept simple
const AuthCtx = createContext({
  token: null,
  roles: [],
  isAuthed: false,
  isAdmin: false,
  setToken: (_t) => {},
  clearToken: () => {},
});

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [roles, setRoles] = useState(() => getRoles());

  // keep state in sync when someone logs in/out anywhere in the app
  useEffect(() => {
    const onAuthChanged = () => {
      setTokenState(getToken());
      setRoles(getRoles());
    };
    window.addEventListener("auth:changed", onAuthChanged);
    // also react to cross-tab changes
    const onStorage = (e) => {
      if (e.key === "jwt") onAuthChanged();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("auth:changed", onAuthChanged);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // methods exposed to components (optional use)
  const setToken = (t) => {
    saveToken(t);
    // saveToken already dispatches "auth:changed"; state will refresh via listener
  };
  const clearToken = () => {
    wipeToken();
    // wipeToken already dispatches "auth:changed"
  };

  const value = useMemo(
    () => ({
      token,
      roles,
      isAuthed: !!token,
      isAdmin: Array.isArray(roles) && roles.includes("Admin"),
      setToken,
      clearToken,
    }),
    [token, roles]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

// optional hook
export function useAuth() {
  return useContext(AuthCtx);
}