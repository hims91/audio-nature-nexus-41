
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface AudioPlayerProps {
  audioUrl?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [audioError, setAudioError] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Reset state when audio URL changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioError(false);
    
    // Set volume when audio element is created
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [audioUrl]);
  
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Use a Promise with catch to handle any errors
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setAudioError(false);
            })
            .catch(error => {
              console.error("Audio playback error:", error);
              setAudioError(true);
              setIsPlaying(false);
            });
        }
      }
    }
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      // Set volume again once metadata is loaded
      audioRef.current.volume = volume;
    }
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };
  
  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Return null if no audioUrl is provided
  if (!audioUrl) {
    return null;
  }
  
  // Properly encode the URL to handle spaces and special characters
  const safeAudioUrl = audioUrl.startsWith("http") 
    ? audioUrl 
    : encodeURI(audioUrl);
  
  return (
    <div className="bg-white/80 rounded-lg p-4 shadow-sm">
      <audio
        ref={audioRef}
        src={safeAudioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={() => setAudioError(true)}
        preload="metadata"
        style={{ display: 'none' }}
      />
      
      {audioError ? (
        <div className="text-sm text-red-500 mb-2">
          Audio could not be loaded. The file may be missing or in an unsupported format.
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Button
            onClick={togglePlayPause}
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>
          
          <div className="flex-1">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="my-1"
            />
            <div className="flex justify-between text-xs text-nature-bark mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration || 0)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-2 w-24">
            <Volume2 size={16} className="text-nature-bark" />
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="my-1"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
