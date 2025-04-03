
import React, { useState } from "react";

interface VideoPlayerProps {
  videoUrl?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  
  // Return null if no videoUrl is provided
  if (!videoUrl) {
    return null;
  }
  
  // Properly encode the URL to handle spaces and special characters
  const safeVideoUrl = videoUrl.startsWith("http") 
    ? videoUrl 
    : encodeURI(videoUrl);
  
  const handleVideoLoad = () => {
    setIsLoading(false);
    setVideoError(false);
  };
  
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error("Video error loading:", videoUrl, e);
    setVideoError(true);
    setIsLoading(false);
  };
  
  return (
    <div className="bg-white/80 rounded-md overflow-hidden">
      {isLoading && !videoError && (
        <div className="bg-gray-100 h-40 flex items-center justify-center">
          <div className="animate-pulse text-nature-forest">Loading video...</div>
        </div>
      )}
      
      {videoError ? (
        <div className="bg-red-50 text-red-500 p-4 text-sm">
          Unable to load video. The file may be missing or in an unsupported format.
          <p className="text-xs mt-2 text-nature-bark">Path: {videoUrl}</p>
        </div>
      ) : (
        <video 
          controls 
          className="w-full h-auto" 
          src={safeVideoUrl}
          preload="metadata"
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          poster="/placeholder.svg"
        >
          <source src={safeVideoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default VideoPlayer;
