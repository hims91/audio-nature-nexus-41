
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Music2, FileVideo, LinkIcon } from "lucide-react";
import { ImageUploader } from "../ImageUploader";
import { AudioUploader } from "../AudioUploader";
import { VideoUploader } from "../VideoUploader";
import { LinksEditor } from "../LinksEditor";
import { PortfolioItem } from "@/data/portfolio";

interface MediaTabsProps {
  currentItem: PortfolioItem;
  setCurrentItem: React.Dispatch<React.SetStateAction<PortfolioItem | null>>;
  audioFile: File | null;
  setAudioFile: React.Dispatch<React.SetStateAction<File | null>>;
  audioFileName: string;
  setAudioFileName: React.Dispatch<React.SetStateAction<string>>;
  videoFile: File | null;
  setVideoFile: React.Dispatch<React.SetStateAction<File | null>>;
  videoFileName: string;
  setVideoFileName: React.Dispatch<React.SetStateAction<string>>;
  imageFile: File | null;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  imageFileName: string;
  setImageFileName: React.Dispatch<React.SetStateAction<string>>;
  imagePreview: string | null;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  newLinkTitle: string;
  setNewLinkTitle: React.Dispatch<React.SetStateAction<string>>;
  newLinkUrl: string;
  setNewLinkUrl: React.Dispatch<React.SetStateAction<string>>;
  newLinkIcon: string;
  setNewLinkIcon: React.Dispatch<React.SetStateAction<string>>;
  onAddLink: () => void;
  onRemoveLink: (index: number) => void;
  toast: any;
}

const MediaTabs: React.FC<MediaTabsProps> = ({
  currentItem,
  setCurrentItem,
  audioFile,
  setAudioFile,
  audioFileName,
  setAudioFileName,
  videoFile,
  setVideoFile,
  videoFileName,
  setVideoFileName,
  imageFile,
  setImageFile,
  imageFileName,
  setImageFileName,
  imagePreview,
  setImagePreview,
  newLinkTitle,
  setNewLinkTitle,
  newLinkUrl,
  setNewLinkUrl,
  newLinkIcon,
  setNewLinkIcon,
  onAddLink,
  onRemoveLink,
  toast
}) => {
  return (
    <Tabs defaultValue="image" className="w-full mt-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="image" className="flex items-center">
          <Image className="mr-2 h-4 w-4" />
          Image
        </TabsTrigger>
        <TabsTrigger value="audio" className="flex items-center">
          <Music2 className="mr-2 h-4 w-4" />
          Audio
        </TabsTrigger>
        <TabsTrigger value="video" className="flex items-center">
          <FileVideo className="mr-2 h-4 w-4" />
          Video
        </TabsTrigger>
        <TabsTrigger value="links" className="flex items-center">
          <LinkIcon className="mr-2 h-4 w-4" />
          Links
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="image" className="mt-4">
        <ImageUploader
          currentItem={currentItem}
          imageFile={imageFile}
          setImageFile={setImageFile}
          imageFileName={imageFileName}
          setImageFileName={setImageFileName}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          toast={toast}
        />
      </TabsContent>
      
      <TabsContent value="audio" className="mt-4">
        <AudioUploader
          currentItem={currentItem}
          audioFile={audioFile}
          setAudioFile={setAudioFile}
          audioFileName={audioFileName}
          setAudioFileName={setAudioFileName}
          toast={toast}
        />
      </TabsContent>
      
      <TabsContent value="video" className="mt-4">
        <VideoUploader
          currentItem={currentItem}
          videoFile={videoFile}
          setVideoFile={setVideoFile}
          videoFileName={videoFileName}
          setVideoFileName={setVideoFileName}
          toast={toast}
        />
      </TabsContent>
      
      <TabsContent value="links" className="mt-4">
        <LinksEditor
          currentItem={currentItem}
          setCurrentItem={setCurrentItem}
          newLinkTitle={newLinkTitle}
          setNewLinkTitle={setNewLinkTitle}
          newLinkUrl={newLinkUrl}
          setNewLinkUrl={setNewLinkUrl}
          newLinkIcon={newLinkIcon}
          setNewLinkIcon={setNewLinkIcon}
          onAddLink={onAddLink}
          onRemoveLink={onRemoveLink}
        />
      </TabsContent>
    </Tabs>
  );
};

export default MediaTabs;
