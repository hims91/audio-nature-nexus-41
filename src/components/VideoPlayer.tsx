
import React, { useState, useRef, useEffect } from "react";
import { Play } from "lucide-react";

interface VideoPlayerProps {
  videoUrl?: string;
  poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, poster }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" } // Load when it's 100px away from viewport
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(containerRef.current);
      }
    };
  }, []);
  
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
    setErrorMessage("Unable to load video. The file may be missing or unsupported.");
  };

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setShowPlayButton(false);
    }
  };
  
  return (
    <div ref={containerRef} className="relative bg-black rounded-lg overflow-hidden shadow-lg group">
      {isIntersecting ? (
        <>
          {videoError ? (
            <div className="bg-red-50 text-red-500 p-4 text-sm aspect-video flex flex-col items-center justify-center">
              <p>{errorMessage}</p>
              <p className="text-xs mt-2 text-nature-bark break-all">Path: {videoUrl}</p>
            </div>
          ) : (
            <>
              {showPlayButton && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 backdrop-blur-sm transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={handlePlayClick}
                    className="bg-white/20 hover:bg-white/30 rounded-full p-4 transition-all duration-200 transform hover:scale-110"
                    aria-label="Play video"
                  >
                    <Play className="w-8 h-8 text-white ml-1" />
                  </button>
                </div>
              )}

              <video 
                ref={videoRef}
                controls={!showPlayButton}
                className="w-full h-auto aspect-video" 
                src={safeVideoUrl}
                preload="metadata"
                onLoadedData={handleVideoLoad}
                onError={handleVideoError}
                poster={poster || "/placeholder.svg"}
                playsInline
                onPlay={() => setShowPlayButton(false)}
                onPause={() => setShowPlayButton(true)}
              >
                <source src={safeVideoUrl} type="video/mp4" />
                <source src={safeVideoUrl} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </>
          )}
        </>
      ) : (
         <div className="aspect-video bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
           {poster ? (
             <img src={poster} alt="Video poster" className="w-full h-full object-cover" />
           ) : (
             <div className="animate-pulse text-nature-forest">Loading video...</div>
           )}
         </div>
      )}
    </div>
  );
};

export default VideoPlayer;
