
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortfolioItem } from "@/data/portfolio";

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
      
      setVideoFile(file);
      setVideoFileName(file.name);
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
      <p className="text-xs text-muted-foreground mt-1">
        Upload MP4, MOV, or other video files
      </p>
      {currentItem.videoUrl && (
        <div className="mt-2">
          <p className="text-sm font-medium">Current Video:</p>
          <p className="text-xs text-nature-forest">{currentItem.videoUrl}</p>
          <video 
            controls 
            className="w-full mt-2 h-auto" 
            src={currentItem.videoUrl}
          />
        </div>
      )}
    </div>
  );
};
