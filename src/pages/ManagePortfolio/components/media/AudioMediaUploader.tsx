
import React from "react";
import { AudioUploadEnhanced } from "@/components/audio/AudioUploadEnhanced";

interface AudioMediaUploaderProps {
  currentUrl?: string;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  toast: any;
  onFileUploaded?: (url: string, path: string) => void;
  onUploadStatusChange?: (isUploading: boolean, hasUploaded: boolean) => void;
}

export const AudioMediaUploader: React.FC<AudioMediaUploaderProps> = ({
  currentUrl,
  file,
  setFile,
  toast,
  onFileUploaded,
  onUploadStatusChange
}) => {
  return (
    <AudioUploadEnhanced
      currentUrl={currentUrl}
      file={file}
      setFile={setFile}
      toast={toast}
      onUploadComplete={onFileUploaded}
      onUploadStatusChange={onUploadStatusChange}
    />
  );
};
