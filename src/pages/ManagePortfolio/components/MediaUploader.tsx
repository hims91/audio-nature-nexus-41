import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import VideoPlayer from "@/components/VideoPlayer";

interface MediaUploaderProps {
  type: "image" | "audio" | "video";
  currentUrl?: string;
  imagePreview?: string; // Only for image type
  setImagePreview?: (preview: string) => void; // Only for image type
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  toast: any;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  type,
  currentUrl,
  imagePreview,
  setImagePreview,
  file,
  setFile,
  toast
}) => {
  const [fileName, setFileName] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  
  const getAcceptTypes = () => {
    switch (type) {
      case "image": return "image/*";
      case "audio": return "audio/*";
      case "video": return "video/*";
      default: return "";
    }
  };
  
  const getMaxSize = () => {
    switch (type) {
      case "image": return 5; // 5MB
      case "audio": return 50; // Increased from 15MB to 50MB
      case "video": return 100; // 100MB
      default: return 10;
    }
  };
  
  const getTitle = () => {
    switch (type) {
      case "image": return "Cover Image";
      case "audio": return "Audio File";
      case "video": return "Video File";
      default: return "File";
    }
  };
  
  const getDescription = () => {
    switch (type) {
      case "image": return "Upload a cover image for your portfolio item (JPG, PNG, WebP)";
      case "audio": return "Upload an audio preview (MP3, WAV, OGG)";
      case "video": return "Upload a video preview (MP4, WebM)";
      default: return "";
    }
  };
  
  const getTargetDirectory = () => {
    switch (type) {
      case "image": return "images";
      case "audio": return "audio";
      case "video": return "videos";
      default: return "";
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const selectedFile = files[0];
    const fileType = selectedFile.type;
    
    if (
      (type === "image" && !fileType.startsWith("image/")) ||
      (type === "audio" && !fileType.startsWith("audio/")) ||
      (type === "video" && !fileType.startsWith("video/"))
    ) {
      toast({
        title: "Invalid File Type",
        description: `Please select a ${type} file.`,
        variant: "destructive"
      });
      return;
    }
    
    const fileSizeInMB = selectedFile.size / 1024 / 1024;
    const maxSize = getMaxSize();
    
    if (fileSizeInMB > maxSize) {
      toast({
        title: "File Too Large",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} files must be smaller than ${maxSize}MB. Selected file is ${fileSizeInMB.toFixed(2)}MB.`,
        variant: "destructive"
      });
      return;
    }
    
    const sanitizedFileName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    setFileName(sanitizedFileName);
    setFile(selectedFile);
    setIsSaved(false);
    
    if (type === "image" && setImagePreview) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(selectedFile);
    }
    
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Selected`,
      description: sanitizedFileName
    });
  };
  
  const handleSaveFile = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file first",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const targetDir = getTargetDirectory();
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('targetDir', targetDir);
        
        const response = await fetch('/api/save-file', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          setIsSaved(true);
          toast({
            title: "File Saved",
            description: `${fileName} has been saved to the public/${targetDir}/ directory.`,
          });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save file');
        }
      };
      
      reader.onerror = () => {
        throw new Error('Failed to read file');
      };
    } catch (error) {
      console.error('Error saving file:', error);
      toast({
        title: "Error Saving File",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };
  
  const handleClearFile = () => {
    setFile(null);
    setFileName("");
    setIsSaved(false);
    if (type === "image" && setImagePreview) {
      setImagePreview("");
    }
  };
  
  const hasCurrentMedia = (url?: string) => {
    return url && url.trim() !== '';
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-nature-forest mb-2">{getTitle()}</h3>
        <p className="text-sm text-nature-bark mb-4">{getDescription()}</p>
        
        <div className="flex flex-col space-y-2">
          <Label htmlFor={`${type}-upload`}>Select {getTitle()}</Label>
          <Input
            id={`${type}-upload`}
            type="file"
            accept={getAcceptTypes()}
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          
          {file && (
            <div className="flex items-center mt-2">
              <span className="text-sm text-nature-forest flex-grow">
                {fileName} {isSaved && <span className="text-green-500 ml-2">(Saved)</span>}
              </span>
              <div className="flex space-x-2">
                {!isSaved && (
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleSaveFile}
                    className="bg-nature-forest hover:bg-nature-leaf"
                  >
                    Save to {getTargetDirectory()}
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearFile}
                  className="text-red-500 hover:text-red-700"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
          
          <div className={`flex items-start gap-2 mt-1 text-xs ${isSaved ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'} p-2 rounded`}>
            {isSaved ? (
              <>
                <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">File saved successfully</p>
                  <p>The file has been saved to <code className="text-green-800">public/{getTargetDirectory()}/</code> directory.</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">File save required</p>
                  <p>After selecting your file, click 'Save to {getTargetDirectory()}' to save it to the <code className="text-amber-800">public/{getTargetDirectory()}/</code> directory.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {type === "image" && (
        <div className="mt-6 space-y-4">
          <h4 className="text-sm font-medium text-nature-forest">Preview</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hasCurrentMedia(currentUrl) && (
              <div>
                <p className="text-xs text-nature-bark mb-1">Current Image:</p>
                <div className="h-48 rounded-md overflow-hidden bg-gray-100 border">
                  <img 
                    src={currentUrl} 
                    alt="Current cover" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                      e.currentTarget.className = "w-full h-full object-contain p-4";
                    }}
                  />
                </div>
                <p className="text-xs text-nature-bark mt-1 truncate">{currentUrl}</p>
              </div>
            )}
            
            {imagePreview && (
              <div>
                <p className="text-xs text-nature-bark mb-1">New Image Preview:</p>
                <div className="h-48 rounded-md overflow-hidden bg-gray-100 border">
                  <img 
                    src={imagePreview} 
                    alt="New cover preview" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                {fileName && (
                  <p className="text-xs text-nature-bark mt-1">Will be saved as: {fileName}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {type === "audio" && hasCurrentMedia(currentUrl) && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-nature-forest mb-2">Current Audio:</h4>
          <AudioPlayer audioUrl={currentUrl} />
          <p className="text-xs text-nature-bark mt-1">{currentUrl}</p>
        </div>
      )}
      
      {type === "video" && hasCurrentMedia(currentUrl) && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-nature-forest mb-2">Current Video:</h4>
          <VideoPlayer videoUrl={currentUrl} />
          <p className="text-xs text-nature-bark mt-1">{currentUrl}</p>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
