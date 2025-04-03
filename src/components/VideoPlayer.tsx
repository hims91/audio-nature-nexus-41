
import React, { useState } from "react";

interface VideoPlayerProps {
  videoUrl?: string;
  poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, poster = "/placeholder.svg" }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
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
    
    // Try to determine a more specific error message
    const video = e.currentTarget;
    
    if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      setErrorMessage("Video file not found or format not supported by your browser.");
    } else if (video.networkState === HTMLMediaElement.NETWORK_EMPTY) {
      setErrorMessage("Video resource could not be loaded.");
    } else {
      setErrorMessage("Unable to load video. The file may be missing or in an unsupported format.");
    }
  };
  
  return (
    <div className="bg-white/80 rounded-md overflow-hidden shadow-sm">
      {isLoading && !videoError && (
        <div className="bg-gray-100 h-40 flex items-center justify-center">
          <div className="animate-pulse text-nature-forest">Loading video...</div>
        </div>
      )}
      
      {videoError ? (
        <div className="bg-red-50 text-red-500 p-4 text-sm">
          {errorMessage}
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
          poster={poster}
        >
          <source src={safeVideoUrl} type="video/mp4" />
          <source src={safeVideoUrl} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default VideoPlayer;
