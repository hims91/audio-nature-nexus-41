
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PortfolioItem } from "@/data/portfolio";
import BasicInfoForm from "./editor/BasicInfoForm";
import MediaTabs from "./editor/MediaTabs";
import FooterActions from "./editor/FooterActions";
import { handleAddLink, handleRemoveLink } from "../utils/linkUtils";

interface ItemEditorProps {
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
  onUpdate: () => void;
  toast: any;
}

const ItemEditor: React.FC<ItemEditorProps> = ({
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
  onUpdate,
  toast
}) => {
  
  const handleLinkAdd = () => handleAddLink(
    currentItem,
    setCurrentItem,
    newLinkTitle,
    newLinkUrl,
    newLinkIcon,
    setNewLinkTitle,
    setNewLinkUrl,
    setNewLinkIcon,
    toast
  );
  
  const handleLinkRemove = (index: number) => handleRemoveLink(
    index,
    currentItem,
    setCurrentItem,
    toast
  );

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-nature-forest">
          Edit: {currentItem.title}
        </h2>
        
        <div className="space-y-4">
          <BasicInfoForm 
            currentItem={currentItem}
            setCurrentItem={setCurrentItem}
          />
          
          <MediaTabs 
            currentItem={currentItem}
            setCurrentItem={setCurrentItem}
            audioFile={audioFile}
            setAudioFile={setAudioFile}
            audioFileName={audioFileName}
            setAudioFileName={setAudioFileName}
            videoFile={videoFile}
            setVideoFile={setVideoFile}
            videoFileName={videoFileName}
            setVideoFileName={setVideoFileName}
            imageFile={imageFile}
            setImageFile={setImageFile}
            imageFileName={imageFileName}
            setImageFileName={setImageFileName}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            newLinkTitle={newLinkTitle}
            setNewLinkTitle={setNewLinkTitle}
            newLinkUrl={newLinkUrl}
            setNewLinkUrl={setNewLinkUrl}
            newLinkIcon={newLinkIcon}
            setNewLinkIcon={setNewLinkIcon}
            onAddLink={handleLinkAdd}
            onRemoveLink={handleLinkRemove}
            toast={toast}
          />
          
          <FooterActions 
            onCancel={() => setCurrentItem(null)}
            onUpdate={onUpdate}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemEditor;
