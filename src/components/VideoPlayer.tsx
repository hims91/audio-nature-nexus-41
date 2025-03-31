
import React, { useState } from "react";
import { Play } from "lucide-react";

interface VideoPlayerProps {
  videoUrl?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  const [isLoading, setIsLoading] = useState(true);

  if (!videoUrl) {
    return null;
  }

  return (
    <div className="mt-4 rounded-md overflow-hidden shadow-md relative">
      {isLoading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
      <video
        controls
        className="w-full h-auto"
        preload="metadata"
        onLoadedData={() => setIsLoading(false)}
        poster="/placeholder.svg"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
