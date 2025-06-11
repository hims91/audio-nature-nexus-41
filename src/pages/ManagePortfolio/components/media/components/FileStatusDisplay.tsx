
import React from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

interface FileStatusDisplayProps {
  isSaved: boolean;
  targetDirectory: string;
}

export const FileStatusDisplay: React.FC<FileStatusDisplayProps> = ({
  isSaved,
  targetDirectory
}) => {
  return (
    <div className={`flex items-start gap-2 mt-1 text-xs ${isSaved ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'} p-2 rounded`}>
      {isSaved ? (
        <>
          <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">File downloaded successfully</p>
            <p>Please manually save the downloaded file to your <code className="text-green-800">public/{targetDirectory}/</code> directory.</p>
          </div>
        </>
      ) : (
        <>
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">File save required</p>
            <p>After selecting your file, click 'Save to {targetDirectory}' to download it. Then manually save it to the <code className="text-amber-800">public/{targetDirectory}/</code> directory.</p>
          </div>
        </>
      )}
    </div>
  );
};
