
import React from "react";
import { BaseMediaUploader, BaseMediaUploaderProps } from "./BaseMediaUploader";
import VideoPlayer from "@/components/VideoPlayer";

type VideoMediaUploaderProps = Omit<BaseMediaUploaderProps, 'type' | 'children'>;

export const VideoMediaUploader: React.FC<VideoMediaUploaderProps> = ({
  currentUrl,
  file,
  setFile,
  toast
}) => {
  const hasCurrentMedia = (url?: string) => url && url.trim() !== '';
  
  return (
    <BaseMediaUploader
      type="video"
      currentUrl={currentUrl}
      file={file}
      setFile={setFile}
      toast={toast}
    >
      {hasCurrentMedia(currentUrl) && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-nature-forest mb-2">Current Video:</h4>
          <VideoPlayer videoUrl={currentUrl} />
          <p className="text-xs text-nature-bark mt-1">{currentUrl}</p>
        </div>
      )}
    </BaseMediaUploader>
  );
};
