
import { useState, useCallback } from "react";

interface UploadStatus {
  audio: {
    isUploading: boolean;
    hasUploaded: boolean;
    url?: string;
  };
  image: {
    isUploading: boolean;
    hasUploaded: boolean;
    url?: string;
  };
  video: {
    isUploading: boolean;
    hasUploaded: boolean;
    url?: string;
  };
}

export const useUploadStatus = () => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    audio: { isUploading: false, hasUploaded: false },
    image: { isUploading: false, hasUploaded: false },
    video: { isUploading: false, hasUploaded: false }
  });

  const updateUploadStatus = useCallback((
    type: keyof UploadStatus, 
    isUploading: boolean, 
    hasUploaded: boolean,
    url?: string
  ) => {
    setUploadStatus(prev => ({
      ...prev,
      [type]: {
        isUploading,
        hasUploaded,
        url: hasUploaded ? url : prev[type].url
      }
    }));
  }, []);

  const resetUploadStatus = useCallback((type: keyof UploadStatus) => {
    setUploadStatus(prev => ({
      ...prev,
      [type]: { isUploading: false, hasUploaded: false }
    }));
  }, []);

  const isAnyUploading = Object.values(uploadStatus).some(status => status.isUploading);
  const canSave = !isAnyUploading;

  return {
    uploadStatus,
    updateUploadStatus,
    resetUploadStatus,
    isAnyUploading,
    canSave
  };
};
