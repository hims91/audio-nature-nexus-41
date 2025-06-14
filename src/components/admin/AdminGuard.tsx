
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Shield } from "lucide-react";
import LoadingSpinner from "@/components/animations/LoadingSpinner";

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // For now, check if user email is the admin email
  // In production, this should check the user_profiles.role field
  const isAdmin = user.email === 'TerraEchoStudios@gmail.com';

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto p-6">
          <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
            <Shield className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <strong>Access Denied</strong>
              <br />
              You don't have permission to access the admin panel. Only administrators can manage portfolio items and access admin features.
            </AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <button 
              onClick={() => window.history.back()}
              className="text-nature-forest hover:text-nature-leaf underline"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
