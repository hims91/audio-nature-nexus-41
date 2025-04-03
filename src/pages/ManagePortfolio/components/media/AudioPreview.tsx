
import React from "react";
import AudioPlayer from "@/components/AudioPlayer";

interface AudioPreviewProps {
  currentUrl?: string;
}

const AudioPreview: React.FC<AudioPreviewProps> = ({ currentUrl }) => {
  if (!currentUrl) return null;
  
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-nature-forest mb-2">Current Audio:</h4>
      <AudioPlayer audioUrl={currentUrl} />
      <p className="text-xs text-nature-bark mt-1">{currentUrl}</p>
    </div>
  );
};

export default AudioPreview;
