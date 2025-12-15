import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  allowedRoles?: ("candidate" | "recruiter")[];
};

function ProtectedRoute({ children, allowedRoles }: Props) {
  const { isAuthenticated, role } = useAuth();

  console.log("Auth:", { isAuthenticated, role });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
