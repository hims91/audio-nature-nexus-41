
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import MediaUploader from "../MediaUploader";
import { PortfolioFormData } from "./PortfolioFormData";
import { useUploadStatus } from "@/hooks/useUploadStatus";

interface MediaTabsProps {
  formData: PortfolioFormData;
  setFormData: React.Dispatch<React.SetStateAction<PortfolioFormData>>;
  coverImageFile: File | null;
  setCoverImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  audioFile: File | null;
  setAudioFile: React.Dispatch<React.SetStateAction<File | null>>;
  videoFile: File | null;
  setVideoFile: React.Dispatch<React.SetStateAction<File | null>>;
  toast: any;
  onUploadStatusChange?: (isAnyUploading: boolean, canSave: boolean) => void;
}

const MediaTabs: React.FC<MediaTabsProps> = ({
  formData,
  setFormData,
  coverImageFile,
  setCoverImageFile,
  audioFile,
  setAudioFile,
  videoFile,
  setVideoFile,
  toast,
  onUploadStatusChange
}) => {
  const { uploadStatus, updateUploadStatus, isAnyUploading, canSave } = useUploadStatus();

  // Notify parent about upload status changes
  React.useEffect(() => {
    if (onUploadStatusChange) {
      onUploadStatusChange(isAnyUploading, canSave);
    }
  }, [isAnyUploading, canSave, onUploadStatusChange]);

  const handleImageUploaded = (url: string, path: string) => {
    console.log('🖼️ Image uploaded successfully:', url);
    setFormData(prev => {
      const updated = { ...prev, coverImageUrl: url };
      console.log('📊 Updated form data with image URL:', updated);
      return updated;
    });
    updateUploadStatus('image', false, true, url);
    toast({
      title: "Image Uploaded",
      description: "Cover image has been uploaded successfully."
    });
  };

  const handleAudioUploaded = (url: string, path: string) => {
    console.log('🎵 Audio uploaded successfully:', url);
    setFormData(prev => {
      const updated = { ...prev, audioUrl: url };
      console.log('📊 Updated form data with audio URL:', updated);
      return updated;
    });
    updateUploadStatus('audio', false, true, url);
    toast({
      title: "Audio Uploaded",
      description: "Audio file has been uploaded successfully."
    });
  };

  const handleVideoUploaded = (url: string, path: string) => {
    console.log('🎬 Video uploaded successfully:', url);
    setFormData(prev => {
      const updated = { ...prev, videoUrl: url };
      console.log('📊 Updated form data with video URL:', updated);
      return updated;
    });
    updateUploadStatus('video', false, true, url);
    toast({
      title: "Video Uploaded", 
      description: "Video file has been uploaded successfully."
    });
  };

  const handleAudioUploadStatus = (isUploading: boolean, hasUploaded: boolean) => {
    updateUploadStatus('audio', isUploading, hasUploaded);
  };

  const handleImageUploadStatus = (isUploading: boolean, hasUploaded: boolean) => {
    updateUploadStatus('image', isUploading, hasUploaded);
  };

  const handleVideoUploadStatus = (isUploading: boolean, hasUploaded: boolean) => {
    updateUploadStatus('video', isUploading, hasUploaded);
  };

  return (
    <>
      {/* Cover Image Tab */}
      <TabsContent value="image" className="py-4">
        <MediaUploader
          type="image"
          currentUrl={formData.coverImageUrl}
          imagePreview={formData.coverImagePreview}
          setImagePreview={(preview) => setFormData(prev => ({ ...prev, coverImagePreview: preview }))}
          file={coverImageFile}
          setFile={setCoverImageFile}
          toast={toast}
          onFileUploaded={handleImageUploaded}
          onUploadStatusChange={handleImageUploadStatus}
        />
      </TabsContent>
      
      {/* Audio & Video Tab */}
      <TabsContent value="media" className="py-4 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-nature-forest">Audio File</h3>
          <MediaUploader
            type="audio"
            currentUrl={formData.audioUrl}
            file={audioFile}
            setFile={setAudioFile}
            toast={toast}
            onFileUploaded={handleAudioUploaded}
            onUploadStatusChange={handleAudioUploadStatus}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-nature-forest">Video File</h3>
          <MediaUploader
            type="video"
            currentUrl={formData.videoUrl}
            file={videoFile}
            setFile={setVideoFile}
            toast={toast}
            onFileUploaded={handleVideoUploaded}
            onUploadStatusChange={handleVideoUploadStatus}
          />
        </div>

        {/* Upload Status Summary */}
        {isAnyUploading && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-800">Uploads in progress...</p>
            <p className="text-xs text-blue-600 mt-1">Please wait for uploads to complete before saving.</p>
          </div>
        )}
      </TabsContent>
    </>
  );
};

export default MediaTabs;
