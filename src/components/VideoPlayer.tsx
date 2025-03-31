
import React from "react";

interface VideoPlayerProps {
  videoUrl?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  if (!videoUrl) {
    return null;
  }

  return (
    <div className="mt-4 rounded-md overflow-hidden shadow-md">
      <video
        controls
        className="w-full h-auto"
        preload="metadata"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
