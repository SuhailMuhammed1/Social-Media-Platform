import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);
  if (isLoading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
