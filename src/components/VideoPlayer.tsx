
import React, { useState, useRef, useEffect } from "react";
import { Play, AlertCircle, RefreshCw } from "lucide-react";

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
  const [retryCount, setRetryCount] = useState(0);
  
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
      { rootMargin: "100px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);
  
  // Return null if no videoUrl is provided
  if (!videoUrl) {
    return null;
  }
  
  // Enhanced URL validation and formatting
  const formatVideoUrl = (url: string): string => {
    if (!url || url.trim() === '') return '';
    
    // If it's already a proper HTTP/HTTPS URL, return as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    
    // If it's a Supabase storage URL pattern, return as is
    if (url.includes('supabase.co/storage/')) {
      return url;
    }
    
    // For relative paths, encode properly
    return encodeURI(url);
  };

  const safeVideoUrl = formatVideoUrl(videoUrl);
  
  const handleVideoLoad = () => {
    console.log('✅ Video loaded successfully:', safeVideoUrl);
    setIsLoading(false);
    setVideoError(false);
    setErrorMessage("");
  };
  
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error("❌ Video error loading:", {
      originalUrl: videoUrl,
      safeUrl: safeVideoUrl,
      error: e
    });
    
    setVideoError(true);
    setIsLoading(false);
    
    // Enhanced error messaging
    if (videoUrl.includes('supabase.co')) {
      setErrorMessage("Video file not accessible. It may be in a private bucket or the file was removed.");
    } else if (videoUrl.startsWith('/')) {
      setErrorMessage("Video file not found in the public directory. Please check if the file exists.");
    } else {
      setErrorMessage("Unable to load video. The file may be missing, corrupted, or in an unsupported format.");
    }
  };

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setShowPlayButton(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setVideoError(false);
    setIsLoading(true);
    
    if (videoRef.current) {
      videoRef.current.load();
    }
  };
  
  return (
    <div ref={containerRef} className="relative bg-black rounded-lg overflow-hidden shadow-lg group">
      {isIntersecting ? (
        <>
          {videoError ? (
            <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-6 text-sm aspect-video flex flex-col items-center justify-center space-y-3">
              <AlertCircle className="h-12 w-12 mb-2" />
              <p className="text-center font-medium">{errorMessage}</p>
              <p className="text-xs text-red-500 dark:text-red-400 break-all text-center max-w-full">
                URL: {videoUrl}
              </p>
              {retryCount < 3 && (
                <button
                  onClick={handleRetry}
                  className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors flex items-center"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry ({retryCount + 1}/3)
                </button>
              )}
            </div>
          ) : (
            <>
              {showPlayButton && !isLoading && (
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

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                  <RefreshCw className="w-8 h-8 text-white animate-spin" />
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
                key={`${safeVideoUrl}-${retryCount}`} // Force re-render on retry
              >
                <source src={safeVideoUrl} type="video/mp4" />
                <source src={safeVideoUrl} type="video/webm" />
                <source src={safeVideoUrl} type="video/mov" />
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
