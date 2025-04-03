
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortfolioItem } from "@/data/portfolio";
import { AlertCircle } from "lucide-react";

interface VideoUploaderProps {
  currentItem: PortfolioItem;
  videoFile: File | null;
  setVideoFile: React.Dispatch<React.SetStateAction<File | null>>;
  videoFileName: string;
  setVideoFileName: React.Dispatch<React.SetStateAction<string>>;
  toast: any;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  currentItem,
  videoFile,
  setVideoFile,
  videoFileName,
  setVideoFileName,
  toast
}) => {
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a video file (MP4, MOV, etc.)",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size
      const fileSizeInMB = file.size / 1024 / 1024;
      if (fileSizeInMB > 50) {
        toast({
          title: "Video file too large",
          description: "Please use a video file smaller than 50MB",
          variant: "destructive"
        });
        return;
      }
      
      // Sanitize filename to remove problematic characters
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      
      setVideoFile(file);
      setVideoFileName(sanitizedFileName);
      
      toast({
        title: "Video file selected",
        description: "Click 'Save Changes' to update the portfolio item with this video file.",
      });
    }
  };

  return (
    <div>
      <Label htmlFor="video">Video File</Label>
      <div className="flex items-center gap-2 mt-1">
        <div className="flex-grow">
          <Input
            id="video"
            className="cursor-pointer"
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
          />
        </div>
        {videoFileName && (
          <div className="text-sm text-nature-forest">
            {videoFileName}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 mt-1 text-xs text-amber-600">
        <AlertCircle className="h-4 w-4" />
        <span>
          After uploading, you'll need to manually copy this file to your public/videos/ directory
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Upload MP4, MOV, or other video files (max 50MB)
      </p>
      {currentItem.videoUrl && (
        <div className="mt-2">
          <p className="text-sm font-medium">Current Video:</p>
          <p className="text-xs text-nature-forest">{currentItem.videoUrl}</p>
          <div className="relative mt-2">
            <video 
              controls 
              className="w-full h-auto" 
              src={encodeURI(currentItem.videoUrl)}
              preload="metadata"
              onError={(e) => {
                console.error("Error loading video:", currentItem.videoUrl);
                const container = e.currentTarget.parentElement;
                if (container) {
                  const errorMsg = document.createElement("div");
                  errorMsg.className = "absolute inset-0 flex items-center justify-center bg-red-50 text-red-500 text-sm p-4";
                  errorMsg.innerHTML = `Could not load video file. It may be missing or have an unsupported format.<br><span class="text-xs mt-1 block">Path: ${currentItem.videoUrl}</span>`;
                  container.appendChild(errorMsg);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
