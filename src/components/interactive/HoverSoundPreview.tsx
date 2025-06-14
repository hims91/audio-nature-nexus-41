
import React, { useState, useRef } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import AudioVisualizer from "../animations/AudioVisualizer";

interface HoverSoundPreviewProps {
  audioUrl: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const HoverSoundPreview: React.FC<HoverSoundPreviewProps> = ({
  audioUrl,
  title,
  children,
  className = ""
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Audio play failed:", error);
          setIsLoading(false);
        });
    }
  };

  return (
    <div
      className={`relative group transition-all duration-300 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {/* Hover overlay */}
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 flex items-center justify-center ${
        isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="text-center text-white space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Volume2 className="w-5 h-5" />
            <span className="text-sm font-medium">{title}</span>
          </div>
          
          <AudioVisualizer 
            isPlaying={isPlaying} 
            barCount={12}
            className="w-24 mx-auto"
          />
          
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200 transform hover:scale-110"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />
    </div>
  );
};

export default HoverSoundPreview;
