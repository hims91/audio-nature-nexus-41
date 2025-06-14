
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import PortfolioLayout from "./PortfolioLayout";

const AuthGuard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PortfolioLayout>
      <Alert className="max-w-2xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please sign in to manage your portfolio items. You need to be authenticated to create, edit, or delete portfolio items.
        </AlertDescription>
      </Alert>
      <div className="text-center mt-8">
        <Button onClick={() => navigate('/auth')} className="bg-nature-forest hover:bg-nature-leaf">
          Sign In
        </Button>
      </div>
    </PortfolioLayout>
  );
};

export default AuthGuard;
