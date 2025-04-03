
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import {
  validateFileType,
  validateFileSize,
  sanitizeFileName,
  getAcceptTypes,
  getTargetDirectory,
  getMediaTitle
} from "../../utils/mediaUtils";

interface FileUploaderProps {
  type: "image" | "audio" | "video";
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  fileName: string;
  setFileName: React.Dispatch<React.SetStateAction<string>>;
  setImagePreview?: (preview: string) => void;
  toast: any;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  type,
  file,
  setFile,
  fileName,
  setFileName,
  setImagePreview,
  toast
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const selectedFile = files[0];
    
    // Validate file type
    if (!validateFileType(selectedFile, type, toast)) return;
    
    // Validate file size
    if (!validateFileSize(selectedFile, type, toast)) return;
    
    // Sanitize filename
    const sanitizedFileName = sanitizeFileName(selectedFile.name);
    setFileName(sanitizedFileName);
    setFile(selectedFile);
    
    // Create image preview if it's an image
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
  
  const handleClearFile = () => {
    setFile(null);
    setFileName("");
    if (type === "image" && setImagePreview) {
      setImagePreview("");
    }
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor={`${type}-upload`}>Select {getMediaTitle(type)}</Label>
      <Input
        id={`${type}-upload`}
        type="file"
        accept={getAcceptTypes(type)}
        onChange={handleFileChange}
        className="cursor-pointer"
      />
      
      {file && (
        <div className="flex items-center mt-2">
          <span className="text-sm text-nature-forest flex-grow">
            {fileName}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearFile}
            className="text-red-500 hover:text-red-700"
          >
            Clear
          </Button>
        </div>
      )}
      
      <div className="flex items-start gap-2 mt-1 text-xs text-amber-600 bg-amber-50 p-2 rounded">
        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Manual file copying required</p>
          <p>After saving, you'll need to manually copy this file to your <code className="text-amber-800">public/{getTargetDirectory(type)}/</code> directory for it to display properly.</p>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
