
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import MediaUploader from "../MediaUploader";
import { PortfolioFormData } from "./PortfolioFormData";

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
  toast
}) => {
  const handleImageUploaded = (url: string, path: string) => {
    console.log('🖼️ Image uploaded successfully:', url);
    setFormData(prev => {
      const updated = { ...prev, coverImageUrl: url };
      console.log('📊 Updated form data with image URL:', updated);
      return updated;
    });
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
    toast({
      title: "Video Uploaded", 
      description: "Video file has been uploaded successfully."
    });
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
          />
        </div>
      </TabsContent>
    </>
  );
};

export default MediaTabs;
