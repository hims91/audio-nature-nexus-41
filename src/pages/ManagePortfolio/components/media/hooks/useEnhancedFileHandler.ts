
import { useState, useEffect } from "react";
import { validateFileType, validateFileSize } from "../utils/fileValidation";
import { sanitizeFileName, getMaxSize, getTargetDirectory } from "../utils/mediaUtils";

interface UseEnhancedFileHandlerProps {
  type: "image" | "audio" | "video";
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  toast: any;
}

export const useEnhancedFileHandler = ({ type, file, setFile, toast }: UseEnhancedFileHandlerProps) => {
  const [fileName, setFileName] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [dragActive, setDragActive] = useState<boolean>(false);
  
  // Reset saved state when file changes
  useEffect(() => {
    if (file) {
      setIsSaved(false);
      setUploadProgress(0);
    }
  }, [file]);
  
  const validateAndSetFile = (selectedFile: File) => {
    // Validate file type
    const typeValidation = validateFileType(selectedFile, type);
    if (!typeValidation.isValid) {
      toast({
        title: "Invalid File Type",
        description: typeValidation.error,
        variant: "destructive"
      });
      return false;
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
      return false;
    }
    
    const sanitizedFileName = sanitizeFileName(selectedFile.name);
    setFileName(sanitizedFileName);
    setFile(selectedFile);
    setIsSaved(false);
    
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Selected`,
      description: `${sanitizedFileName} ready for upload`
    });
    
    return true;
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const selectedFile = files[0];
    validateAndSetFile(selectedFile);
  };
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };
  
  const simulateUploadProgress = () => {
    return new Promise<void>((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          setUploadProgress(100);
          clearInterval(interval);
          resolve();
        } else {
          setUploadProgress(progress);
        }
      }, 200);
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
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const targetDir = getTargetDirectory(type);
      
      // Simulate upload progress
      await simulateUploadProgress();
      
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
      setIsUploading(false);
      
      toast({
        title: "File Ready for Manual Save",
        description: `${fileName} has been downloaded. Please save it to your public/${targetDir}/ directory to complete the upload.`,
      });
      
    } catch (error) {
      console.error('Error saving file:', error);
      setIsUploading(false);
      setUploadProgress(0);
      toast({
        title: "Error Processing File",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };
  
  const handleClearFile = () => {
    setFile(null);
    setFileName("");
    setIsSaved(false);
    setIsUploading(false);
    setUploadProgress(0);
  };
  
  const handleReplaceFile = () => {
    handleClearFile();
    toast({
      title: "File Cleared",
      description: "You can now select a new file",
    });
  };
  
  return {
    fileName,
    isSaved,
    isUploading,
    uploadProgress,
    dragActive,
    handleFileChange,
    handleSaveFile,
    handleClearFile,
    handleReplaceFile,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop
  };
};
