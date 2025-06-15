
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface EditorActionsProps {
  mode: "create" | "edit";
  onCancel: () => void;
  isLoading?: boolean;
  canSave?: boolean;
}

const EditorActions: React.FC<EditorActionsProps> = ({
  mode,
  onCancel,
  isLoading = false,
  canSave = true
}) => {
  return (
    <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancel
      </Button>
      
      <Button
        type="submit"
        disabled={isLoading || !canSave}
        className="bg-nature-forest hover:bg-nature-leaf"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {mode === "create" ? "Create Portfolio Item" : "Save Changes"}
      </Button>
      
      {!canSave && !isLoading && (
        <p className="text-xs text-amber-600 mt-1">
          Please complete all uploads before saving
        </p>
      )}
    </div>
  );
};

export default EditorActions;
