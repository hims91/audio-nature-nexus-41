
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface PortfolioHeaderProps {
  userEmail?: string;
  onCreateNew: () => void;
  isCreating: boolean;
  isLoading?: boolean;
}

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({ 
  userEmail, 
  onCreateNew, 
  isCreating,
  isLoading = false
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-nature-forest mb-2">Portfolio Manager</h1>
          {userEmail && (
            <p className="text-nature-bark text-sm">
              Signed in as: {userEmail}
            </p>
          )}
        </div>
        <Button 
          onClick={onCreateNew}
          className="bg-nature-forest hover:bg-nature-leaf"
          disabled={isCreating || isLoading}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {isCreating ? 'Creating...' : 'New Portfolio Item'}
        </Button>
      </div>
      <p className="text-nature-bark max-w-3xl">
        Create and manage your portfolio items with audio, video, and images. 
        All data is securely stored in your Supabase database.
      </p>
    </div>
  );
};

export default PortfolioHeader;
