
import React from "react";
import { BaseMediaUploader, BaseMediaUploaderProps } from "./BaseMediaUploader";
import AudioPlayer from "@/components/AudioPlayer";

type AudioMediaUploaderProps = Omit<BaseMediaUploaderProps, 'type' | 'children'>;

export const AudioMediaUploader: React.FC<AudioMediaUploaderProps> = ({
  currentUrl,
  file,
  setFile,
  toast
}) => {
  const hasCurrentMedia = (url?: string) => url && url.trim() !== '';
  
  return (
    <BaseMediaUploader
      type="audio"
      currentUrl={currentUrl}
      file={file}
      setFile={setFile}
      toast={toast}
    >
      {hasCurrentMedia(currentUrl) && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-nature-forest mb-2">Current Audio:</h4>
          <AudioPlayer audioUrl={currentUrl} />
          <p className="text-xs text-nature-bark mt-1">{currentUrl}</p>
        </div>
      )}
    </BaseMediaUploader>
  );
};
