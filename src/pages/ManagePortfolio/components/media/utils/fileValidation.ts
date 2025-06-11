
export const validateFileType = (file: File, type: "image" | "audio" | "video") => {
  const fileType = file.type;
  
  if (
    (type === "image" && !fileType.startsWith("image/")) ||
    (type === "audio" && !fileType.startsWith("audio/")) ||
    (type === "video" && !fileType.startsWith("video/"))
  ) {
    return {
      isValid: false,
      error: `Please select a ${type} file.`
    };
  }
  
  return { isValid: true };
};

export const validateFileSize = (file: File, maxSizeMB: number, type: string) => {
  const fileSizeInMB = file.size / 1024 / 1024;
  
  if (fileSizeInMB > maxSizeMB) {
    return {
      isValid: false,
      error: `${type.charAt(0).toUpperCase() + type.slice(1)} files must be smaller than ${maxSizeMB}MB. Selected file is ${fileSizeInMB.toFixed(2)}MB.`
    };
  }
  
  return { isValid: true };
};
