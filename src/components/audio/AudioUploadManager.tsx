
import React, { useState, useCallback } from "react";
import { BaseMediaUploader } from "@/pages/ManagePortfolio/components/media/BaseMediaUploader";
import AudioPlayer from "@/components/AudioPlayer";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";

interface AudioUploadManagerProps {
  currentUrl?: string;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  toast: any;
  onUploadComplete?: (url: string, path: string) => void;
  onUploadStatusChange?: (isUploading: boolean, hasUploaded: boolean) => void;
}

export const AudioUploadManager: React.FC<AudioUploadManagerProps> = ({
  currentUrl,
  file,
  setFile,
  toast,
  onUploadComplete,
  onUploadStatusChange
}) => {
  const [uploadedUrl, setUploadedUrl] = useState<string>(currentUrl || "");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");

  const handleFileUploaded = useCallback((url: string, path: string) => {
    console.log('🎵 Audio upload completed:', { url, path });
    setUploadedUrl(url);
    setUploadError("");
    
    // Notify parent components immediately
    if (onUploadComplete) {
      onUploadComplete(url, path);
    }
    
    // Update upload status
    if (onUploadStatusChange) {
      onUploadStatusChange(false, true);
    }
    
    toast({
      title: "Audio Upload Complete",
      description: "Your audio file is ready to be saved with the portfolio item.",
    });
  }, [onUploadComplete, onUploadStatusChange, toast]);

  const handleUploadStart = useCallback(() => {
    setIsUploading(true);
    setUploadError("");
    
    if (onUploadStatusChange) {
      onUploadStatusChange(true, false);
    }
  }, [onUploadStatusChange]);

  const handleUploadError = useCallback((error: string) => {
    setIsUploading(false);
    setUploadError(error);
    
    if (onUploadStatusChange) {
      onUploadStatusChange(false, false);
    }
  }, [onUploadStatusChange]);

  const hasValidAudio = uploadedUrl && uploadedUrl.trim() !== '';

  return (
    <div className="space-y-4">
      <BaseMediaUploader
        type="audio"
        currentUrl={currentUrl}
        file={file}
        setFile={setFile}
        toast={toast}
        onFileUploaded={handleFileUploaded}
        onUploadStart={handleUploadStart}
        onUploadError={handleUploadError}
      >
        {/* Upload Status Indicator */}
        <div className="mt-4">
          {uploadError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div className="text-sm">
                <p className="font-medium text-red-800">Upload Error</p>
                <p className="text-red-700">{uploadError}</p>
              </div>
            </div>
          )}

          {hasValidAudio && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div className="text-sm">
                  <p className="font-medium text-green-800">Audio Ready</p>
                  <p className="text-green-700">Your audio file has been uploaded and is ready to save.</p>
                  <p className="text-xs text-green-600 mt-1 break-all">URL: {uploadedUrl}</p>
                </div>
              </div>

              {/* Audio Preview */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Audio Preview:</h4>
                <AudioPlayer audioUrl={uploadedUrl} />
              </div>
            </div>
          )}
        </div>
      </BaseMediaUploader>
    </div>
  );
};
