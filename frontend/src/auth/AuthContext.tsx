import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import api from "../api/axios";

/**
 * Use BACKEND roles directly
 */
type UserRole = "applicant" | "recruiter";

type AuthContextType = {
  isAuthenticated: boolean;
  role: UserRole | null;
  isInitializing: boolean;
  login: (token: string, role: UserRole) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  /**
   * Restore session on page refresh
   * Calls /user/me ONLY if token exists
   */
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        const res = await api.get("/user/me");

        // ✅ Direct backend role
        setIsAuthenticated(true);
        setRole(res.data.user.role);
      } catch (err) {
        console.error("Session restore failed", err);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setRole(null);
      } finally {
        setIsInitializing(false);
      }
    };

    restoreSession();
  }, []);

  /**
   * Called after successful login / register
   */
  const login = (token: string, userRole: UserRole) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setRole(userRole);
  };

  /**
   * Logout user and clear session
   */
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setRole(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        isInitializing,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
