import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, AlertTriangle } from "lucide-react";
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
    // Create more dynamic-looking waveform data
    const data = Array.from({ length: 60 }, () => 5 + Math.random() * 95);
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
    <div className="bg-slate-800/30 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg border border-slate-700/30">
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
        <div className="text-sm text-slate-400 dark:text-slate-300 mb-2 text-center animate-pulse">
          Loading audio...
        </div>
      )}
      
      {audioError ? (
        <div className="text-sm text-amber-500 mb-2 text-center p-3 bg-amber-500/10 dark:bg-amber-900/20 rounded-lg flex items-center justify-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <p className="font-medium">Audio could not be loaded</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Waveform Visualization */}
          <div className="relative h-14 sm:h-16 bg-black/20 rounded-lg overflow-hidden">
            <div className="flex items-end justify-center h-full gap-0.5 sm:gap-1 p-1">
              {waveformData.map((height, index) => (
                <div
                  key={index}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    (index / waveformData.length) * 100 <= getProgress()
                      ? 'bg-cyan-400'
                      : 'bg-slate-600'
                  }`}
                  style={{ height: `${height}%` }}
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
              className={`${isMobile ? 'w-full py-3' : 'h-11 w-11'} rounded-full border-slate-600 text-slate-300 hover:bg-cyan-500 hover:text-white hover:border-cyan-500 dark:border-slate-500 dark:text-slate-300 shadow-lg transition-all duration-200 transform hover:scale-105`}
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
            
            <div className={`${isMobile ? 'w-full' : 'flex-1'} space-y-1.5`}>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="my-1 [&>span:first-child]:bg-cyan-400"
              />
              <div className="flex justify-between text-xs text-slate-400 dark:text-slate-400">
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
                  className="h-8 w-8 text-slate-400 hover:text-white"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="flex-1 [&>span:first-child]:bg-slate-400"
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
