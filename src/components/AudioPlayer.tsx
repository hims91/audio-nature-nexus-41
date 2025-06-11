
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
  const [isLoading, setIsLoading] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Reset state when audio URL changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioError(false);
    setIsLoading(true);
    
    if (audioRef.current) {
      audioRef.current.load(); // Force reload of audio element
      audioRef.current.volume = volume;
    }
  }, [audioUrl]);
  
  const togglePlayPause = async () => {
    if (!audioRef.current) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Ensure we can play the audio
        await audioRef.current.play();
        setIsPlaying(true);
        setAudioError(false);
      }
    } catch (error) {
      console.error("Audio playback error:", error);
      setAudioError(true);
      setIsPlaying(false);
    }
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current && !isNaN(audioRef.current.currentTime)) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
      audioRef.current.volume = volume;
      setIsLoading(false);
      setAudioError(false);
    }
  };
  
  const handleCanPlayThrough = () => {
    setIsLoading(false);
    setAudioError(false);
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };
  
  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    console.error("Audio loading error:", {
      url: audioUrl,
      error: e.currentTarget.error,
      networkState: e.currentTarget.networkState,
      readyState: e.currentTarget.readyState
    });
    setAudioError(true);
    setIsLoading(false);
    setIsPlaying(false);
  };
  
  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current && !isNaN(newTime)) {
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
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Return null if no audioUrl is provided
  if (!audioUrl) {
    return null;
  }
  
  return (
    <div className="bg-white/80 rounded-lg p-4 shadow-sm">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlayThrough={handleCanPlayThrough}
        onEnded={handleEnded}
        onError={handleAudioError}
        preload="metadata"
        crossOrigin="anonymous"
        style={{ display: 'none' }}
      />
      
      {isLoading && !audioError && (
        <div className="text-sm text-nature-bark mb-2">
          Loading audio...
        </div>
      )}
      
      {audioError ? (
        <div className="text-sm text-red-500 mb-2">
          <p>Unable to load audio file.</p>
          <p className="text-xs mt-1 text-nature-bark">
            URL: {audioUrl}
          </p>
          <p className="text-xs text-gray-500">
            This may be due to CORS restrictions or the file format not being supported by your browser.
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Button
            onClick={togglePlayPause}
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white"
            disabled={isLoading}
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
              disabled={isLoading || audioError}
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
              disabled={isLoading || audioError}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
