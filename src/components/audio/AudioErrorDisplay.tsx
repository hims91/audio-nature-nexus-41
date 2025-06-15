
import React from "react";
import { AlertTriangle } from "lucide-react";

const AudioErrorDisplay: React.FC = () => {
  return (
    <div className="text-sm text-amber-500 mb-2 text-center p-3 bg-amber-500/10 dark:bg-amber-900/20 rounded-lg flex items-center justify-center gap-2">
      <AlertTriangle className="h-5 w-5" />
      <p className="font-medium">Audio could not be loaded</p>
    </div>
  );
};

export default AudioErrorDisplay;
