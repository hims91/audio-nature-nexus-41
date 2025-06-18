
import { useState, useCallback } from 'react';

interface UploadStatus {
  image: { isUploading: boolean; hasUploaded: boolean; url?: string };
  audio: { isUploading: boolean; hasUploaded: boolean; url?: string };
  video: { isUploading: boolean; hasUploaded: boolean; url?: string };
}

export const useUploadStatus = () => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    image: { isUploading: false, hasUploaded: false },
    audio: { isUploading: false, hasUploaded: false },
    video: { isUploading: false, hasUploaded: false }
  });

  const updateUploadStatus = useCallback((
    type: 'image' | 'audio' | 'video',
    isUploading: boolean,
    hasUploaded: boolean,
    url?: string
  ) => {
    setUploadStatus(prev => ({
      ...prev,
      [type]: { isUploading, hasUploaded, url }
    }));
  }, []);

  const isAnyUploading = Object.values(uploadStatus).some(status => status.isUploading);
  const canSave = !isAnyUploading;

  const resetUploadStatus = useCallback(() => {
    setUploadStatus({
      image: { isUploading: false, hasUploaded: false },
      audio: { isUploading: false, hasUploaded: false },
      video: { isUploading: false, hasUploaded: false }
    });
  }, []);

  return {
    uploadStatus,
    updateUploadStatus,
    isAnyUploading,
    canSave,
    resetUploadStatus
  };
};
