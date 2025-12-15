import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../api/axios";

type UserRole = "candidate" | "recruiter";

type AuthContextType = {
  isAuthenticated: boolean;
  role: UserRole | null;
  isInitializing: boolean;
  login: (role: UserRole) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.get("/user/me");
        const backendRole = res.data.user.role;

        setIsAuthenticated(true);
        setRole(
          backendRole === "applicant" ? "candidate" : "recruiter"
        );
      } catch {
        setIsAuthenticated(false);
        setRole(null);
      } finally {
        setIsInitializing(false);
      }
    };

    restoreSession();
  }, []);

  const login = (userRole: UserRole) => {
    setIsAuthenticated(true);
    setRole(userRole);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch(err) {
      console.error(err);
    } finally {
      setIsAuthenticated(false);
      setRole(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role, isInitializing, login, logout }}
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
