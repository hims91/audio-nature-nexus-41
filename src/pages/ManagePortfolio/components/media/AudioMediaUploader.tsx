
import React from "react";
import { AudioUploadManager } from "@/components/audio/AudioUploadManager";

interface AudioMediaUploaderProps {
  currentUrl?: string;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  toast: any;
  onFileUploaded?: (url: string, path: string) => void;
}

export const AudioMediaUploader: React.FC<AudioMediaUploaderProps> = ({
  currentUrl,
  file,
  setFile,
  toast,
  onFileUploaded
}) => {
  return (
    <AudioUploadManager
      currentUrl={currentUrl}
      file={file}
      setFile={setFile}
      toast={toast}
      onUploadComplete={onFileUploaded}
    />
  );
};
