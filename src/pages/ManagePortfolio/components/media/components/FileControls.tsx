
import React from "react";
import { Button } from "@/components/ui/button";

interface FileControlsProps {
  fileName: string;
  isSaved: boolean;
  targetDirectory: string;
  onSave: () => void;
  onClear: () => void;
}

export const FileControls: React.FC<FileControlsProps> = ({
  fileName,
  isSaved,
  targetDirectory,
  onSave,
  onClear
}) => {
  return (
    <div className="flex items-center mt-2">
      <span className="text-sm text-nature-forest flex-grow">
        {fileName} {isSaved && <span className="text-green-500 ml-2">(Downloaded)</span>}
      </span>
      <div className="flex space-x-2">
        {!isSaved && (
          <Button 
            variant="default" 
            size="sm" 
            onClick={onSave}
            className="bg-nature-forest hover:bg-nature-leaf"
          >
            Save to {targetDirectory}
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClear}
          className="text-red-500 hover:text-red-700"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
