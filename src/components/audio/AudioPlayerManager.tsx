
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { AudioWaveform, Pause, AlertCircle } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";

interface AudioPlayerManagerProps {
  audioUrl?: string;
  title?: string;
  className?: string;
  variant?: "default" | "compact" | "inline";
}

// Centralized audio URL validation
export const validateAudioUrl = (url?: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed === '' || trimmed === 'undefined' || trimmed === 'null') return false;
  
  // Check for valid audio file extensions
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];
  const hasValidExtension = audioExtensions.some(ext => 
    trimmed.toLowerCase().includes(ext)
  );
  
  // Check for valid URL format
  const isValidUrl = trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('data:');
  
  return hasValidExtension || isValidUrl;
};

// Centralized audio URL formatting
export const formatAudioUrl = (url: string): string => {
  if (url.startsWith("http") || url.startsWith("data:")) {
    return url;
  }
  return encodeURI(url);
};

const AudioPlayerManager: React.FC<AudioPlayerManagerProps> = ({
  audioUrl,
  title = "Audio",
  className = "",
  variant = "default"
}) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isValidAudio = validateAudioUrl(audioUrl);

  const handleTogglePlayer = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log(`🎵 AudioPlayerManager toggle for "${title}":`, audioUrl);
    
    if (!isValidAudio) {
      console.error('🚫 Invalid audio URL:', audioUrl);
      setHasError(true);
      return;
    }
    
    setShowPlayer(!showPlayer);
    setHasError(false);
  }, [audioUrl, title, isValidAudio, showPlayer]);

  if (!isValidAudio) {
    if (variant === "compact") return null;
    
    return (
      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>Audio unavailable</span>
      </div>
    );
  }

  const buttonContent = showPlayer ? (
    <>
      <Pause className="w-4 h-4 mr-2" />
      Hide Player
    </>
  ) : (
    <>
      <AudioWaveform className="w-4 h-4 mr-2" />
      Listen Now
    </>
  );

  const renderButton = () => {
    switch (variant) {
      case "compact":
        return (
          <Button
            onClick={handleTogglePlayer}
            size="sm"
            variant="outline"
            className="text-xs cursor-pointer"
          >
            {buttonContent}
          </Button>
        );
      
      case "inline":
        return (
          <Button
            onClick={handleTogglePlayer}
            variant="ghost"
            size="sm"
            className="h-8 px-3 cursor-pointer"
          >
            {buttonContent}
          </Button>
        );
      
      default:
        return (
          <Button
            onClick={handleTogglePlayer}
            className={`${
              showPlayer 
                ? 'bg-nature-leaf hover:bg-nature-forest' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
            } text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer`}
          >
            {buttonContent}
          </Button>
        );
    }
  };

  return (
    <div className={className}>
      {hasError && (
        <div className="mb-2 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded text-red-800 dark:text-red-200 text-sm">
          Failed to load audio. Please check the file.
        </div>
      )}
      
      <div className="flex justify-center">
        {renderButton()}
      </div>

      {showPlayer && audioUrl && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border-2 border-blue-200 dark:border-gray-500 animate-fade-in">
          <div className="flex items-center mb-2">
            <AudioWaveform className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {title} - Audio Preview
            </span>
          </div>
          <AudioPlayer audioUrl={formatAudioUrl(audioUrl)} />
        </div>
      )}
    </div>
  );
};

export default AudioPlayerManager;
