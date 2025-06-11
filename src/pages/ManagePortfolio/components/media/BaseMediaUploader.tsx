
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadFileToSupabase, FileUploadType } from "@/services/supabaseFileUpload";

export interface BaseMediaUploaderProps {
  type: FileUploadType;
  currentUrl?: string;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  toast: any;
  children?: React.ReactNode;
  onFileUploaded?: (url: string, path: string) => void;
}

export const BaseMediaUploader: React.FC<BaseMediaUploaderProps> = ({
  type,
  currentUrl,
  file,
  setFile,
  toast,
  children,
  onFileUploaded
}) => {
  const [uploading, setUploading] = useState(false);

  const getAcceptedTypes = () => {
    switch (type) {
      case 'image':
        return 'image/jpeg,image/png,image/webp,image/gif';
      case 'audio':
        return 'audio/*,.wav,.mp3,.ogg,.m4a';
      case 'video':
        return 'video/*,.mp4,.webm,.mov';
      default:
        return '';
    }
  };

  const getMaxSize = () => {
    switch (type) {
      case 'image':
        return '10MB';
      case 'audio':
        return '50MB';
      case 'video':
        return '100MB';
      default:
        return '10MB';
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      console.log(`Selected ${type} file:`, selectedFile.name, selectedFile.type, selectedFile.size);
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: `Please select a ${type} file to upload.`,
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    console.log(`Starting ${type} upload process...`);

    try {
      const result = await uploadFileToSupabase(file, type);
      
      if (result.error) {
        throw new Error(result.error);
      }

      console.log(`${type} upload successful:`, result);

      toast({
        title: "Upload successful",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} has been uploaded successfully.`,
      });

      // Notify parent component
      if (onFileUploaded) {
        onFileUploaded(result.url, result.path);
      }

      // Clear the file after successful upload
      setFile(null);

    } catch (error) {
      console.error(`${type} upload failed:`, error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : `Failed to upload ${type}`,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${type}-upload`} className="text-sm font-medium text-nature-forest">
          {type.charAt(0).toUpperCase() + type.slice(1)} File (Max {getMaxSize()})
        </Label>
        <div className="mt-1">
          <Input
            id={`${type}-upload`}
            type="file"
            accept={getAcceptedTypes()}
            onChange={handleFileSelect}
            className="cursor-pointer"
            disabled={uploading}
          />
        </div>
      </div>

      {file && (
        <div className="bg-gray-50 p-3 rounded-md border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-nature-forest">{file.name}</p>
              <p className="text-xs text-nature-bark">
                {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              disabled={uploading}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {file && (
        <Button 
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-nature-forest hover:bg-nature-leaf"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading {type}...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload {type.charAt(0).toUpperCase() + type.slice(1)}
            </>
          )}
        </Button>
      )}

      {children}
    </div>
  );
};
