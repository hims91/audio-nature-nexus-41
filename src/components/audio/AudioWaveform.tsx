
import React from "react";

interface AudioWaveformProps {
  waveformData: number[];
  progress: number;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({ waveformData, progress }) => {
  return (
    <div className="relative h-14 sm:h-16 bg-black/20 rounded-lg overflow-hidden">
      <div className="flex items-end justify-center h-full gap-0.5 sm:gap-1 p-1">
        {waveformData.map((height, index) => (
          <div
            key={index}
            className={`w-1 rounded-full transition-all duration-300 ${
              (index / waveformData.length) * 100 <= progress
                ? 'bg-cyan-400'
                : 'bg-slate-600'
            }`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export default AudioWaveform;
