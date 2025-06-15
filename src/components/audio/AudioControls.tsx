
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";

interface AudioControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  onTogglePlayPause: () => void;
  onToggleMute: () => void;
  onVolumeChange: (value: number[]) => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  isPlaying,
  isMuted,
  volume,
  onTogglePlayPause,
  onToggleMute,
  onVolumeChange,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={`flex items-center ${isMobile ? 'flex-col space-y-3' : 'gap-4'}`}>
      <Button
        onClick={onTogglePlayPause}
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
      
      {!isMobile && (
        <div className="flex items-center gap-2 w-32">
          <Button
            onClick={onToggleMute}
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
            onValueChange={onVolumeChange}
            className="flex-1 [&>span:first-child]:bg-slate-400"
          />
        </div>
      )}
    </div>
  );
};

export default AudioControls;
