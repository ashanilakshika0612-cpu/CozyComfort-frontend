import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CSpinner } from "@coreui/react";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <CSpinner color="primary" />
      </div>
    );

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role))
    return <Navigate to="/dashboard" replace />;

  return children;
};

export default ProtectedRoute;
