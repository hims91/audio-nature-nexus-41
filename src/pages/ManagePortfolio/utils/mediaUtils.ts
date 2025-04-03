
import { toast } from "@/hooks/use-toast";

// File type validation
export const validateFileType = (
  file: File,
  type: "image" | "audio" | "video",
  toast: any
): boolean => {
  if (
    (type === "image" && !file.type.startsWith("image/")) ||
    (type === "audio" && !file.type.startsWith("audio/")) ||
    (type === "video" && !file.type.startsWith("video/"))
  ) {
    toast({
      title: "Invalid File Type",
      description: `Please select a ${type} file.`,
      variant: "destructive"
    });
    return false;
  }
  return true;
};

// File size validation
export const validateFileSize = (
  file: File,
  type: "image" | "audio" | "video",
  toast: any
): boolean => {
  const fileSizeInMB = file.size / 1024 / 1024;
  const maxSize = getMaxSize(type);
  
  if (fileSizeInMB > maxSize) {
    toast({
      title: "File Too Large",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} files must be smaller than ${maxSize}MB. Selected file is ${fileSizeInMB.toFixed(2)}MB.`,
      variant: "destructive"
    });
    return false;
  }
  return true;
};

// Sanitize filename
export const sanitizeFileName = (fileName: string): string => {
  return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
};

// Get max file size based on type
export const getMaxSize = (type: "image" | "audio" | "video"): number => {
  switch (type) {
    case "image": return 5; // 5MB
    case "audio": return 15; // 15MB
    case "video": return 100; // 100MB
    default: return 10;
  }
};

// Get file type title
export const getMediaTitle = (type: "image" | "audio" | "video"): string => {
  switch (type) {
    case "image": return "Cover Image";
    case "audio": return "Audio File";
    case "video": return "Video File";
    default: return "File";
  }
};

// Get file type description
export const getMediaDescription = (type: "image" | "audio" | "video"): string => {
  switch (type) {
    case "image": return "Upload a cover image for your portfolio item (JPG, PNG, WebP)";
    case "audio": return "Upload an audio preview (MP3, WAV, OGG)";
    case "video": return "Upload a video preview (MP4, WebM)";
    default: return "";
  }
};

// Get target directory for the file
export const getTargetDirectory = (type: "image" | "audio" | "video"): string => {
  switch (type) {
    case "image": return "images";
    case "audio": return "audio";
    case "video": return "videos";
    default: return "";
  }
};

// Get accept types for file input
export const getAcceptTypes = (type: "image" | "audio" | "video"): string => {
  switch (type) {
    case "image": return "image/*";
    case "audio": return "audio/*";
    case "video": return "video/*";
    default: return "";
  }
};

// Determine if current URL is valid and not empty
export const hasCurrentMedia = (url?: string): boolean => {
  return Boolean(url && url.trim() !== '');
};
