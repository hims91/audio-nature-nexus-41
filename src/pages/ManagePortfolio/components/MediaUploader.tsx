
import React from "react";
import { ImageMediaUploader } from "./media/ImageMediaUploader";
import { AudioMediaUploader } from "./media/AudioMediaUploader";
import { VideoMediaUploader } from "./media/VideoMediaUploader";

interface MediaUploaderProps {
  type: "image" | "audio" | "video";
  currentUrl?: string;
  imagePreview?: string; // Only for image type
  setImagePreview?: (preview: string) => void; // Only for image type
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  toast: any;
  onFileUploaded?: (url: string, path: string) => void;
  onUploadStatusChange?: (isUploading: boolean, hasUploaded: boolean) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = (props) => {
  const { type } = props;
  
  switch (type) {
    case "image":
      return <ImageMediaUploader {...props} />;
    case "audio":
      return <AudioMediaUploader {...props} />;
    case "video":
      return <VideoMediaUploader {...props} />;
    default:
      return null;
  }
};

export default MediaUploader;
