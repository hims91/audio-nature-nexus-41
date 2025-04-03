
import React from "react";
import VideoPlayer from "@/components/VideoPlayer";

interface VideoPreviewProps {
  currentUrl?: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ currentUrl }) => {
  if (!currentUrl) return null;
  
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-nature-forest mb-2">Current Video:</h4>
      <VideoPlayer videoUrl={currentUrl} />
      <p className="text-xs text-nature-bark mt-1">{currentUrl}</p>
    </div>
  );
};

export default VideoPreview;
