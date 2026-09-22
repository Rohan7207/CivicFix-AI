import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

function ProtectedRoute({
  children,
  allowedRoles = null,
  requiredRole = null,
}) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          <p className="text-sm font-medium text-slate-600">
            Loading account...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const allowed = allowedRoles
    ? allowedRoles.map((role) => String(role).toUpperCase())
    : [];
  const currentRole = String(user.role || "CITIZEN").toUpperCase();
  const targetRole = requiredRole ? String(requiredRole).toUpperCase() : null;

  if (targetRole && currentRole !== targetRole) {
    return (
      <Navigate
        to={currentRole === "ADMIN" ? "/admin" : "/dashboard"}
        replace
      />
    );
  }

  if (allowed.length > 0 && !allowed.includes(currentRole)) {
    return (
      <Navigate
        to={currentRole === "ADMIN" ? "/admin" : "/dashboard"}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
