
import React from "react";
import { FileVideo } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";

interface VideoPreviewProps {
  videoUrl: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ videoUrl }) => {
  return (
    <div className="mb-3">
      <div className="bg-purple-50 dark:bg-gray-700 p-3 rounded-lg border-2 border-purple-200">
        <div className="flex items-center mb-2">
          <FileVideo className="h-4 w-4 mr-1 text-purple-600" />
          <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Video Preview</span>
        </div>
        <VideoPlayer videoUrl={videoUrl} />
      </div>
    </div>
  );
};

export default VideoPreview;
