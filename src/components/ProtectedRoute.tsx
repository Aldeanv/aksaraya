import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ProtectedRouteProps } from "../types";


export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
