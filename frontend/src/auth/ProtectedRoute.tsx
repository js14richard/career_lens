import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

type Props = {
  allowedRoles?: ("applicant" | "recruiter")[];
};

function ProtectedRoute({ allowedRoles }: Props) {
  const { isAuthenticated, role } = useAuth();

  console.log("Auth:", { isAuthenticated, role });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ REQUIRED FOR NESTED ROUTES
  return <Outlet />;
}

export default ProtectedRoute;
