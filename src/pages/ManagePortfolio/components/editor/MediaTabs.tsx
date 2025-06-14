
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
    setFormData(prev => ({ ...prev, coverImageUrl: url }));
    console.log('Image uploaded:', url);
  };

  const handleAudioUploaded = (url: string, path: string) => {
    setFormData(prev => ({ ...prev, audioUrl: url }));
    console.log('Audio uploaded:', url);
  };

  const handleVideoUploaded = (url: string, path: string) => {
    setFormData(prev => ({ ...prev, videoUrl: url }));
    console.log('Video uploaded:', url);
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
        <MediaUploader
          type="audio"
          currentUrl={formData.audioUrl}
          file={audioFile}
          setFile={setAudioFile}
          toast={toast}
          onFileUploaded={handleAudioUploaded}
        />
        
        <MediaUploader
          type="video"
          currentUrl={formData.videoUrl}
          file={videoFile}
          setFile={setVideoFile}
          toast={toast}
          onFileUploaded={handleVideoUploaded}
        />
      </TabsContent>
    </>
  );
};

export default MediaTabs;
