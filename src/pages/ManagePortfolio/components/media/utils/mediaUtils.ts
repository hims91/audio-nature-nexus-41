
export const getAcceptTypes = (type: "image" | "audio" | "video") => {
  switch (type) {
    case "image": return "image/*";
    case "audio": return "audio/*";
    case "video": return "video/*";
    default: return "";
  }
};

export const getMaxSize = (type: "image" | "audio" | "video") => {
  switch (type) {
    case "image": return 5; // 5MB
    case "audio": return 100; // Increased from 50MB to 100MB
    case "video": return 100; // 100MB
    default: return 10;
  }
};

export const getTitle = (type: "image" | "audio" | "video") => {
  switch (type) {
    case "image": return "Cover Image";
    case "audio": return "Audio File";
    case "video": return "Video File";
    default: return "File";
  }
};

export const getDescription = (type: "image" | "audio" | "video") => {
  switch (type) {
    case "image": return "Upload a cover image for your portfolio item (JPG, PNG, WebP)";
    case "audio": return "Upload an audio preview (MP3, WAV, OGG) - up to 100MB";
    case "video": return "Upload a video preview (MP4, WebM)";
    default: return "";
  }
};

export const getTargetDirectory = (type: "image" | "audio" | "video") => {
  switch (type) {
    case "image": return "images";
    case "audio": return "audio";
    case "video": return "videos";
    default: return "";
  }
};

export const sanitizeFileName = (fileName: string) => {
  return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
};
