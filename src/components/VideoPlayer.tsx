
import React, { useState, useEffect } from "react";
import { Play } from "lucide-react";

interface VideoPlayerProps {
  videoUrl?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [videoExists, setVideoExists] = useState(true);

  useEffect(() => {
    // Reset states when videoUrl changes
    setIsLoading(true);
    setHasError(false);
    setVideoExists(true);
  }, [videoUrl]);

  if (!videoUrl) {
    return null;
  }

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setVideoExists(true);
    setRetryCount((prev) => prev + 1);
  };

  return (
    <div className="mt-4 rounded-md overflow-hidden shadow-md relative">
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
      
      {hasError ? (
        <div className="bg-black/10 h-32 flex flex-col items-center justify-center text-nature-bark">
          <p className="text-sm mb-2">Video could not be loaded</p>
          <button 
            onClick={handleRetry}
            className="px-3 py-1 bg-nature-forest text-white text-xs rounded-md hover:bg-nature-leaf transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <video
          key={`video-${retryCount}`} // Key helps force reload on retry
          controls
          className="w-full h-auto"
          preload="metadata"
          onLoadedData={() => setIsLoading(false)}
          onError={(e) => {
            setIsLoading(false);
            setHasError(true);
            console.error("Video error loading:", videoUrl, e);
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
