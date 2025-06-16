
import React, { useState, useRef, useEffect } from "react";
import AudioControls from "./audio/AudioControls";
import AudioWaveform from "./audio/AudioWaveform";
import AudioProgressBar from "./audio/AudioProgressBar";
import AudioErrorDisplay from "./audio/AudioErrorDisplay";
import AudioLoadingDisplay from "./audio/AudioLoadingDisplay";

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
  const [loadProgress, setLoadProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Generate simple waveform visualization data
  useEffect(() => {
    const data = Array.from({ length: 60 }, () => 5 + Math.random() * 95);
    setWaveformData(data);
  }, [audioUrl]);
  
  // Reset state when audio URL changes
  useEffect(() => {
    console.log('🎵 AudioPlayer received URL:', audioUrl);
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioError(false);
    setIsLoading(true);
    setLoadProgress(0);
    
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [audioUrl]);
  
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        console.log('🎵 Audio paused');
      } else {
        console.log('🎵 Attempting to play audio');
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setAudioError(false);
              console.log('🎵 Audio playing successfully');
            })
            .catch(error => {
              console.error("🚫 Audio playback error:", error);
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

  const handleProgress = () => {
    if (audioRef.current) {
      const buffered = audioRef.current.buffered;
      if (buffered.length > 0) {
        const loadedEnd = buffered.end(buffered.length - 1);
        const duration = audioRef.current.duration;
        if (duration > 0) {
          setLoadProgress((loadedEnd / duration) * 100);
        }
      }
    }
  };
  
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      audioRef.current.volume = isMuted ? 0 : volume;
      setIsLoading(false);
      console.log('🎵 Audio metadata loaded, duration:', audioRef.current.duration);
    }
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    console.log('🎵 Audio can play');
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    console.log('🎵 Audio playback ended');
  };
  
  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    console.error("🚫 Audio error loading:", audioUrl, e);
    setAudioError(true);
    setIsLoading(false);
  };

  const handleLoadStart = () => {
    console.log('🎵 Audio load started');
    setIsLoading(true);
    setAudioError(false);
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
  
  const getProgress = () => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  };
  
  if (!audioUrl) {
    console.warn('🚫 AudioPlayer: No audio URL provided');
    return null;
  }
  
  const safeAudioUrl = audioUrl.startsWith("http") 
    ? audioUrl 
    : encodeURI(audioUrl);
  
  return (
    <div className="bg-slate-800/30 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg border border-slate-700/30">
      <audio
        ref={audioRef}
        src={safeAudioUrl}
        onTimeUpdate={handleTimeUpdate}
        onProgress={handleProgress}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onLoadStart={handleLoadStart}
        onEnded={handleEnded}
        onError={handleAudioError}
        preload="metadata"
        style={{ display: 'none' }}
      />
      
      {isLoading && !audioError && (
        <AudioLoadingDisplay progress={loadProgress} />
      )}
      
      {audioError ? (
        <AudioErrorDisplay />
      ) : (
        <div className="space-y-3">
          <AudioWaveform waveformData={waveformData} progress={getProgress()} />
          <AudioControls
            isPlaying={isPlaying}
            isMuted={isMuted}
            volume={volume}
            onTogglePlayPause={togglePlayPause}
            onToggleMute={toggleMute}
            onVolumeChange={handleVolumeChange}
          />
          <AudioProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
