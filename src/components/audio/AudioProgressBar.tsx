
import React from "react";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";

interface AudioProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (value: number[]) => void;
}

const AudioProgressBar: React.FC<AudioProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
}) => {
  const isMobile = useIsMobile();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={`${isMobile ? 'w-full' : 'flex-1'} space-y-1.5`}>
      <Slider
        value={[currentTime]}
        max={duration || 100}
        step={0.1}
        onValueChange={onSeek}
        className="my-1 [&>span:first-child]:bg-cyan-400"
      />
      <div className="flex justify-between text-xs text-slate-400 dark:text-slate-400">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration || 0)}</span>
      </div>
    </div>
  );
};

export default AudioProgressBar;
