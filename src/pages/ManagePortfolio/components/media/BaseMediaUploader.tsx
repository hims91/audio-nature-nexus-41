
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";

export interface BaseMediaUploaderProps {
  type: "image" | "audio" | "video";
  currentUrl?: string;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  toast: any;
  children?: React.ReactNode;
}

export const BaseMediaUploader: React.FC<BaseMediaUploaderProps> = ({
  type,
  file,
  setFile,
  toast,
  children
}) => {
  const [fileName, setFileName] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  
  // Reset saved state when file changes
  useEffect(() => {
    if (file) {
      setIsSaved(false);
    }
  }, [file]);
  
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
      case "audio": return 50; // 50MB
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
    
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Selected`,
      description: `${sanitizedFileName} - Click "Save to ${getTargetDirectory()}" to save the file`
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
      // Since we can't actually save files to the server in this environment,
      // we'll simulate the save and provide instructions to the user
      const targetDir = getTargetDirectory();
      
      // Create a download link for the user to manually save the file
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsSaved(true);
      
      toast({
        title: "File Downloaded",
        description: `${fileName} has been downloaded. Please manually save it to your public/${targetDir}/ directory.`,
      });
      
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
                {fileName} {isSaved && <span className="text-green-500 ml-2">(Downloaded)</span>}
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
                  <p className="font-medium">File downloaded successfully</p>
                  <p>Please manually save the downloaded file to your <code className="text-green-800">public/{getTargetDirectory()}/</code> directory.</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">File save required</p>
                  <p>After selecting your file, click 'Save to {getTargetDirectory()}' to download it. Then manually save it to the <code className="text-amber-800">public/{getTargetDirectory()}/</code> directory.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {children}
    </div>
  );
};
