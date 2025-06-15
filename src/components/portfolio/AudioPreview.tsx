
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, AudioWaveform } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";

interface AudioPreviewProps {
  audioUrl: string;
  title: string;
}

const AudioPreview: React.FC<AudioPreviewProps> = ({ audioUrl, title }) => {
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  return (
    <div className="mb-3">
      <Button
        onClick={() => setShowAudioPlayer(!showAudioPlayer)}
        className={`w-full mb-2 ${
          showAudioPlayer 
            ? 'bg-nature-leaf hover:bg-nature-forest' 
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
        } text-white transition-all duration-300`}
        size="sm"
      >
        {showAudioPlayer ? (
          <>
            <Play className="h-3 w-3 mr-1" />
            Hide Audio Player
          </>
        ) : (
          <>
            <AudioWaveform className="h-3 w-3 mr-1" />
            Listen Now
          </>
        )}
      </Button>
      {showAudioPlayer && (
        <div className="bg-blue-50 dark:bg-gray-700 p-3 rounded-lg border-2 border-blue-200">
          <div className="flex items-center mb-2">
            <AudioWaveform className="h-4 w-4 mr-1 text-blue-600" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Audio Preview</span>
          </div>
          <AudioPlayer audioUrl={audioUrl} />
        </div>
      )}
    </div>
  );
};

export default AudioPreview;
