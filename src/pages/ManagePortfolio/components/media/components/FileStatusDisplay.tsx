
import React from "react";
import { AlertCircle, CheckCircle, Info, FolderOpen } from "lucide-react";

interface FileStatusDisplayProps {
  isSaved: boolean;
  targetDirectory: string;
}

export const FileStatusDisplay: React.FC<FileStatusDisplayProps> = ({
  isSaved,
  targetDirectory
}) => {
  if (isSaved) {
    return (
      <div className="flex items-start gap-3 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium text-green-800 mb-1">File Downloaded Successfully</p>
          <p className="text-sm text-green-700 mb-2">
            Your file has been downloaded to your computer. To complete the upload process:
          </p>
          <ol className="text-sm text-green-700 space-y-1 ml-4 list-decimal">
            <li>Locate the downloaded file in your Downloads folder</li>
            <li>Copy the file to your project's <code className="bg-green-100 px-1 rounded">public/{targetDirectory}/</code> directory</li>
            <li>Save your portfolio item to update the file reference</li>
          </ol>
          <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
            <FolderOpen className="h-4 w-4" />
            <span>Target directory: <code className="bg-green-100 px-1 rounded">public/{targetDirectory}/</code></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium text-blue-800 mb-1">How File Upload Works</p>
        <p className="text-sm text-blue-700 mb-2">
          Our file upload process involves these steps:
        </p>
        <ol className="text-sm text-blue-700 space-y-1 ml-4 list-decimal">
          <li>Select or drag & drop your {targetDirectory} file</li>
          <li>Click "Save to {targetDirectory}" to download the file</li>
          <li>Manually copy the downloaded file to <code className="bg-blue-100 px-1 rounded">public/{targetDirectory}/</code></li>
          <li>Submit your portfolio form to save the reference</li>
        </ol>
        <div className="mt-3 flex items-center gap-2 text-xs text-blue-600">
          <AlertCircle className="h-4 w-4" />
          <span>Manual file placement is required due to browser security restrictions</span>
        </div>
      </div>
    </div>
  );
};
