import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser, isAdminLoggedIn } from "utils/auth";

const ProtectedRoute = ({ children, allowAdmin = false }) => {
  const user = getCurrentUser();
  const isAdmin = isAdminLoggedIn();

  if (!user && !(allowAdmin && isAdmin)) {
    return <Navigate to="/register" replace />;
  }

  return children;
};

export default ProtectedRoute;
