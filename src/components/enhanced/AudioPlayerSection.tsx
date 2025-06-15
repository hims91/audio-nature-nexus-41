
import React from "react";
import { Button } from "@/components/ui/button";
import { Pause, AudioWaveform } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import MagneticButton from "../animations/MagneticButton";

interface AudioPlayerSectionProps {
  audioUrl: string;
  showAudioPlayer: boolean;
  onTogglePlayer: () => void;
}

const AudioPlayerSection: React.FC<AudioPlayerSectionProps> = ({
  audioUrl,
  showAudioPlayer,
  onTogglePlayer,
}) => {
  return (
    <>
      {/* Listen Now Button */}
      <div className="flex justify-center">
        <MagneticButton>
          <Button
            onClick={onTogglePlayer}
            className={`${
              showAudioPlayer 
                ? 'bg-nature-leaf hover:bg-nature-forest' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
            } text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg`}
          >
            {showAudioPlayer ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Hide Player
              </>
            ) : (
              <>
                <AudioWaveform className="w-4 h-4 mr-2" />
                Listen Now
              </>
            )}
          </Button>
        </MagneticButton>
      </div>

      {/* Audio Player */}
      {showAudioPlayer && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border-2 border-blue-200 dark:border-gray-500 animate-fade-in">
          <div className="flex items-center mb-2">
            <AudioWaveform className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Audio Preview</span>
          </div>
          <AudioPlayer audioUrl={audioUrl} />
        </div>
      )}
    </>
  );
};

export default AudioPlayerSection;
