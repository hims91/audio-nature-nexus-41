
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthGuard from "@/pages/ManagePortfolio/components/AuthGuard";

const ManagePortfolio: React.FC = () => {
  const { user } = useAuth();
  
  // Check if user is admin (in production, check user_profiles.role)
  const isAdmin = user?.email === 'TerraEchoStudios@gmail.com';

  // Redirect admin users to the new admin panel
  if (user && isAdmin) {
    return <Navigate to="/admin/portfolio" replace />;
  }

  // Non-admin users see access denied message
  if (user && !isAdmin) {
    return <AuthGuard />;
  }

  // Not logged in users get redirected to auth
  return <Navigate to="/auth" replace />;
};

export default ManagePortfolio;
