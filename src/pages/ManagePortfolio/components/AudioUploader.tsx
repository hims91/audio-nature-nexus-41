
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortfolioItem } from "@/data/portfolio";

interface AudioUploaderProps {
  currentItem: PortfolioItem;
  audioFile: File | null;
  setAudioFile: React.Dispatch<React.SetStateAction<File | null>>;
  audioFileName: string;
  setAudioFileName: React.Dispatch<React.SetStateAction<string>>;
  toast: any;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  currentItem,
  audioFile,
  setAudioFile,
  audioFileName,
  setAudioFileName,
  toast
}) => {
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an audio file (MP3, WAV, etc.)",
          variant: "destructive"
        });
        return;
      }
      
      setAudioFile(file);
      setAudioFileName(file.name);
    }
  };

  return (
    <div>
      <Label htmlFor="audio">Audio File</Label>
      <div className="flex items-center gap-2 mt-1">
        <div className="flex-grow">
          <Input
            id="audio"
            className="cursor-pointer"
            type="file"
            accept="audio/*"
            onChange={handleAudioUpload}
          />
        </div>
        {audioFileName && (
          <div className="text-sm text-nature-forest">
            {audioFileName}
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Upload MP3, WAV, or other audio files
      </p>
      {currentItem.audioUrl && (
        <div className="mt-2">
          <p className="text-sm font-medium">Current Audio:</p>
          <p className="text-xs text-nature-forest">{currentItem.audioUrl}</p>
          <audio 
            controls 
            className="w-full mt-2 h-10" 
            src={currentItem.audioUrl}
          />
        </div>
      )}
    </div>
  );
};
