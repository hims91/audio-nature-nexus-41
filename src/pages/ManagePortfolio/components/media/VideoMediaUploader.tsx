
import React from "react";
import { VideoUploadEnhanced } from "@/components/video/VideoUploadEnhanced";

interface VideoMediaUploaderProps {
  currentUrl?: string;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  toast: any;
  onFileUploaded?: (url: string, path: string) => void;
  onUploadStatusChange?: (isUploading: boolean, hasUploaded: boolean) => void;
}

export const VideoMediaUploader: React.FC<VideoMediaUploaderProps> = ({
  currentUrl,
  file,
  setFile,
  toast,
  onFileUploaded,
  onUploadStatusChange
}) => {
  return (
    <VideoUploadEnhanced
      currentUrl={currentUrl}
      file={file}
      setFile={setFile}
      toast={toast}
      onUploadComplete={onFileUploaded}
      onUploadStatusChange={onUploadStatusChange}
    />
  );
};
