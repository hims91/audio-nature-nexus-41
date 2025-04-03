
import React, { useState } from "react";
import { Play } from "lucide-react";

interface VideoPlayerProps {
  videoUrl?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!videoUrl) {
    return null;
  }

  return (
    <div className="mt-4 rounded-md overflow-hidden shadow-md relative">
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
      
      {hasError ? (
        <div className="bg-black/10 h-32 flex items-center justify-center text-nature-bark">
          <p className="text-sm">Video could not be loaded</p>
        </div>
      ) : (
        <video
          controls
          className="w-full h-auto"
          preload="metadata"
          onLoadedData={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
            console.error("Video error loading:", videoUrl);
          }}
          poster="/placeholder.svg"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default VideoPlayer;
