
import React from "react";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AudioLoadingDisplayProps {
  progress?: number;
}

const AudioLoadingDisplay: React.FC<AudioLoadingDisplayProps> = ({ progress = 0 }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-3">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Loading audio...
        </p>
        {progress > 0 && (
          <div className="w-full max-w-xs">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {Math.round(progress)}% loaded
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioLoadingDisplay;
