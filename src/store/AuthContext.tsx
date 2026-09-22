import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { authApi } from "../api/auth";
import { clearToken, getStoredToken, storeToken } from "../api/client";

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  verify: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());

  const login = useCallback((nextToken: string) => {
    storeToken(nextToken);
    setToken(nextToken);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setToken(null);
  }, []);

  const verify = useCallback(async () => {
    if (!getStoredToken()) {
      setToken(null);
      return false;
    }
    try {
      const response = await authApi.verify();
      if (response.data.authenticated) {
        setToken(getStoredToken());
        return true;
      }
    } catch {
      logout();
    }
    return false;
  }, [logout]);

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
      verify,
    }),
    [login, logout, token, verify],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
