
import React, { useEffect, useRef, useState } from "react";

interface AudioVisualizerProps {
  isPlaying?: boolean;
  barCount?: number;
  className?: string;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  isPlaying = false, 
  barCount = 20,
  className = "" 
}) => {
  const [bars, setBars] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Initialize bars with random heights
    setBars(Array.from({ length: barCount }, () => Math.random() * 100 + 10));
  }, [barCount]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setBars(prev => prev.map(() => Math.random() * 100 + 10));
      }, 150);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setBars(Array.from({ length: barCount }, () => 20));
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, barCount]);

  return (
    <div className={`flex items-end justify-center space-x-1 h-16 ${className}`}>
      {bars.map((height, index) => (
        <div
          key={index}
          className="bg-gradient-to-t from-nature-forest to-nature-leaf rounded-t-sm transition-all duration-150 ease-out"
          style={{
            height: `${height}%`,
            width: `${100 / barCount * 0.8}%`,
            minWidth: '2px'
          }}
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;
