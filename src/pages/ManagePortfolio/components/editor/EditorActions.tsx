
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft } from "lucide-react";

interface EditorActionsProps {
  mode: "create" | "edit";
  onCancel: () => void;
  isLoading: boolean;
}

const EditorActions: React.FC<EditorActionsProps> = ({
  mode,
  onCancel,
  isLoading
}) => {
  return (
    <div className="flex justify-between mt-8">
      <Button 
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Cancel
      </Button>
      
      <Button 
        type="submit"
        className="bg-nature-forest hover:bg-nature-leaf"
        disabled={isLoading}
      >
        <Save className="mr-2 h-4 w-4" />
        {isLoading ? 'Saving...' : mode === "create" ? "Create Item" : "Save Changes"}
      </Button>
    </div>
  );
};

export default EditorActions;
