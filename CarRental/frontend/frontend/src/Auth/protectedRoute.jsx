import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.map(r => r.toLowerCase()).includes(user.role?.toLowerCase())
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};


export default ProtectedRoute;