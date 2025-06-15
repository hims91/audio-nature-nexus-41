
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";

interface AudioPlayerProps {
  audioUrl?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMobile = useIsMobile();
  
  // Generate simple waveform visualization data
  useEffect(() => {
    // Create fake waveform data for visual appeal
    const data = Array.from({ length: 50 }, () => Math.random() * 100);
    setWaveformData(data);
  }, [audioUrl]);
  
  // Reset state when audio URL changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioError(false);
    setIsLoading(true);
    
    // Set volume when audio element is created
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [audioUrl]);
  
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
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
  
  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      audioRef.current.volume = newMuted ? 0 : volume;
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
      audioRef.current.volume = isMuted ? 0 : volume;
      setIsLoading(false);
    }
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };
  
  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    console.error("Audio error loading:", audioUrl, e);
    setAudioError(true);
    setIsLoading(false);
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
    if (audioRef.current && !isMuted) {
      audioRef.current.volume = newVolume;
    }
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const getProgress = () => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
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
    <div className="bg-gradient-to-r from-white via-blue-50 to-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-xl p-4 shadow-lg border border-blue-200 dark:border-gray-600">
      <audio
        ref={audioRef}
        src={safeAudioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleAudioError}
        preload="metadata"
        style={{ display: 'none' }}
      />
      
      {isLoading && !audioError && (
        <div className="text-sm text-blue-600 dark:text-blue-400 mb-2 text-center animate-pulse">
          Loading audio...
        </div>
      )}
      
      {audioError ? (
        <div className="text-sm text-red-500 mb-2 text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="font-medium">Audio could not be loaded</p>
          <p className="text-xs mt-1 opacity-70">The file may be missing or in an unsupported format.</p>
          {!isMobile && (
            <p className="text-xs mt-1 text-gray-600 dark:text-gray-400 break-all">Path: {audioUrl}</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Waveform Visualization */}
          <div className="relative h-16 bg-blue-100 dark:bg-gray-600 rounded-lg overflow-hidden">
            <div className="flex items-end justify-center h-full gap-1 p-2">
              {waveformData.map((height, index) => (
                <div
                  key={index}
                  className={`w-1 rounded-t transition-all duration-300 ${
                    (index / waveformData.length) * 100 <= getProgress()
                      ? 'bg-blue-500 dark:bg-blue-400'
                      : 'bg-blue-300 dark:bg-gray-500'
                  }`}
                  style={{ height: `${Math.max(height * 0.4, 8)}%` }}
                />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className={`flex items-center ${isMobile ? 'flex-col space-y-3' : 'gap-4'}`}>
            <Button
              onClick={togglePlayPause}
              variant="outline"
              size={isMobile ? "default" : "icon"}
              className={`${isMobile ? 'w-full py-3' : 'h-12 w-12'} rounded-full border-blue-300 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400 shadow-lg transition-all duration-200 transform hover:scale-105`}
            >
              {isPlaying ? (
                <>
                  <Pause size={isMobile ? 20 : 18} />
                  {isMobile && <span className="ml-2">Pause</span>}
                </>
              ) : (
                <>
                  <Play size={isMobile ? 20 : 18} />
                  {isMobile && <span className="ml-2">Play</span>}
                </>
              )}
            </Button>
            
            <div className={`${isMobile ? 'w-full' : 'flex-1'} space-y-2`}>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="my-1"
              />
              <div className="flex justify-between text-xs text-blue-700 dark:text-blue-300">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration || 0)}</span>
              </div>
            </div>
            
            {!isMobile && (
              <div className="flex items-center gap-2 w-32">
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="flex-1"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
