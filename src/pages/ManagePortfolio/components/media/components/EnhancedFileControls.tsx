
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Trash2, RefreshCw } from "lucide-react";

interface EnhancedFileControlsProps {
  fileName: string;
  isSaved: boolean;
  isUploading: boolean;
  targetDirectory: string;
  onSave: () => void;
  onClear: () => void;
  onReplace: () => void;
}

export const EnhancedFileControls: React.FC<EnhancedFileControlsProps> = ({
  fileName,
  isSaved,
  isUploading,
  targetDirectory,
  onSave,
  onClear,
  onReplace
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-nature-cream/30 rounded-lg">
        <div className="flex items-center space-x-2">
          {isSaved && <CheckCircle2 className="h-4 w-4 text-green-500" />}
          <span className="text-sm font-medium text-nature-forest">
            {fileName}
          </span>
          {isSaved && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              Ready
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          {!isSaved && !isUploading && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={onSave}
              className="bg-nature-forest hover:bg-nature-leaf text-white"
            >
              <Download className="h-3 w-3 mr-1" />
              Save to {targetDirectory}
            </Button>
          )}
          
          {isSaved && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onReplace}
              className="border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Replace
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            disabled={isUploading}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};
