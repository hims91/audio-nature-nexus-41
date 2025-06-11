
import { useState, useEffect } from "react";
import { validateFileType, validateFileSize } from "../utils/fileValidation";
import { sanitizeFileName, getMaxSize, getTargetDirectory } from "../utils/mediaUtils";

interface UseFileHandlerProps {
  type: "image" | "audio" | "video";
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  toast: any;
}

export const useFileHandler = ({ type, file, setFile, toast }: UseFileHandlerProps) => {
  const [fileName, setFileName] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  
  // Reset saved state when file changes
  useEffect(() => {
    if (file) {
      setIsSaved(false);
    }
  }, [file]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const selectedFile = files[0];
    
    // Validate file type
    const typeValidation = validateFileType(selectedFile, type);
    if (!typeValidation.isValid) {
      toast({
        title: "Invalid File Type",
        description: typeValidation.error,
        variant: "destructive"
      });
      return;
    }
    
    // Validate file size
    const maxSize = getMaxSize(type);
    const sizeValidation = validateFileSize(selectedFile, maxSize, type);
    if (!sizeValidation.isValid) {
      toast({
        title: "File Too Large",
        description: sizeValidation.error,
        variant: "destructive"
      });
      return;
    }
    
    const sanitizedFileName = sanitizeFileName(selectedFile.name);
    setFileName(sanitizedFileName);
    setFile(selectedFile);
    setIsSaved(false);
    
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Selected`,
      description: `${sanitizedFileName} - Click "Save to ${getTargetDirectory(type)}" to save the file`
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
      const targetDir = getTargetDirectory(type);
      
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
  
  return {
    fileName,
    isSaved,
    handleFileChange,
    handleSaveFile,
    handleClearFile
  };
};
