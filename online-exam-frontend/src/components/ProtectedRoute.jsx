import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { role, token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
}