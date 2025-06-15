
import React from "react";
import { Video } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";

interface VideoPlayerSectionProps {
  videoUrl: string;
}

const VideoPlayerSection: React.FC<VideoPlayerSectionProps> = ({ videoUrl }) => {
  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border-2 border-purple-200 dark:border-gray-500">
      <div className="flex items-center mb-2">
        <Video className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
        <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Video Preview</span>
      </div>
      <VideoPlayer videoUrl={videoUrl} />
    </div>
  );
};

export default VideoPlayerSection;
