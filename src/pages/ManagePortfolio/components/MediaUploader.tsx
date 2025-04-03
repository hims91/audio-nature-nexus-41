
import React, { useState } from "react";
import { getMediaTitle, getMediaDescription, hasCurrentMedia } from "../utils/mediaUtils";
import FileUploader from "./media/FileUploader";
import ImagePreview from "./media/ImagePreview";
import AudioPreview from "./media/AudioPreview";
import VideoPreview from "./media/VideoPreview";

interface MediaUploaderProps {
  type: "image" | "audio" | "video";
  currentUrl?: string;
  imagePreview?: string; // Only for image type
  setImagePreview?: (preview: string) => void; // Only for image type
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  toast: any;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  type,
  currentUrl,
  imagePreview,
  setImagePreview,
  file,
  setFile,
  toast
}) => {
  const [fileName, setFileName] = useState<string>("");
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-nature-forest mb-2">{getMediaTitle(type)}</h3>
        <p className="text-sm text-nature-bark mb-4">{getMediaDescription(type)}</p>
        
        <FileUploader
          type={type}
          file={file}
          setFile={setFile}
          fileName={fileName}
          setFileName={setFileName}
          setImagePreview={type === "image" ? setImagePreview : undefined}
          toast={toast}
        />
      </div>
      
      {/* Preview Section */}
      {type === "image" && (
        <ImagePreview
          currentUrl={currentUrl}
          imagePreview={imagePreview}
          fileName={fileName}
        />
      )}
      
      {/* Audio Preview */}
      {type === "audio" && hasCurrentMedia(currentUrl) && (
        <AudioPreview currentUrl={currentUrl} />
      )}
      
      {/* Video Preview */}
      {type === "video" && hasCurrentMedia(currentUrl) && (
        <VideoPreview currentUrl={currentUrl} />
      )}
    </div>
  );
};

export default MediaUploader;
