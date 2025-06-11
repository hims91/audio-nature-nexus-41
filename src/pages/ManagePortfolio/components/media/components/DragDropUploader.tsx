
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, FileAudio, FileVideo, FileImage } from "lucide-react";

interface DragDropUploaderProps {
  type: "image" | "audio" | "video";
  acceptTypes: string;
  dragActive: boolean;
  isUploading: boolean;
  uploadProgress: number;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export const DragDropUploader: React.FC<DragDropUploaderProps> = ({
  type,
  acceptTypes,
  dragActive,
  isUploading,
  uploadProgress,
  onFileChange,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop
}) => {
  const getIcon = () => {
    switch (type) {
      case "audio": return <FileAudio className="h-8 w-8 text-nature-bark" />;
      case "video": return <FileVideo className="h-8 w-8 text-nature-bark" />;
      case "image": return <FileImage className="h-8 w-8 text-nature-bark" />;
      default: return <Upload className="h-8 w-8 text-nature-bark" />;
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive 
            ? 'border-nature-forest bg-nature-cream/50' 
            : 'border-nature-bark/30 hover:border-nature-forest/50'
          }
          ${isUploading ? 'pointer-events-none opacity-75' : 'cursor-pointer'}
        `}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <Label htmlFor={`${type}-upload`} className="cursor-pointer">
          <div className="flex flex-col items-center space-y-4">
            {getIcon()}
            <div>
              <p className="text-sm font-medium text-nature-forest">
                Drop your {type} file here or click to browse
              </p>
              <p className="text-xs text-nature-bark mt-1">
                Supports {acceptTypes} files
              </p>
            </div>
          </div>
        </Label>
        
        <Input
          id={`${type}-upload`}
          type="file"
          accept={acceptTypes}
          onChange={onFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
      </div>
      
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-nature-forest">Uploading...</span>
            <span className="text-nature-bark">{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}
    </div>
  );
};
