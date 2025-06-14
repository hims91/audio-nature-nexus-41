
import React, { useState, useRef, useEffect } from "react";
import { Play } from "lucide-react";
import LoadingSpinner from "../animations/LoadingSpinner";

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
}

const LazyVideo: React.FC<LazyVideoProps> = ({
  src,
  poster,
  className = "",
  autoPlay = false,
  muted = true,
  controls = true
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(!autoPlay);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setShowPlayButton(false);
    }
  };

  const handleLoadedData = () => {
    setIsLoaded(true);
    if (autoPlay && videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {!isLoaded && isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {showPlayButton && poster && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
          <button
            onClick={handlePlay}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-4 transition-all duration-200 transform hover:scale-110"
          >
            <Play className="w-8 h-8 text-white ml-1" />
          </button>
        </div>
      )}

      {isInView && (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={poster}
          muted={muted}
          controls={controls && !showPlayButton}
          onLoadedData={handleLoadedData}
          preload="metadata"
        >
          <source src={src} type="video/mp4" />
          <source src={src.replace('.mp4', '.webm')} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default LazyVideo;
