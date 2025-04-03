
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PortfolioItem } from "@/data/portfolio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image, Music2, FileVideo, LinkIcon, PlusCircle, Trash2, Save } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { AudioUploader } from "./AudioUploader";
import { VideoUploader } from "./VideoUploader";
import { LinksEditor } from "./LinksEditor";

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
  
  const handleAddLink = () => {
    if (!currentItem) return;
    if (!newLinkTitle || !newLinkUrl) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and URL for the link",
        variant: "destructive"
      });
      return;
    }
    
    const newLink = {
      title: newLinkTitle,
      url: newLinkUrl,
      icon: newLinkIcon
    };
    
    const updatedOtherLinks = currentItem.otherLinks ? [...currentItem.otherLinks, newLink] : [newLink];
    
    setCurrentItem({
      ...currentItem,
      otherLinks: updatedOtherLinks
    });
    
    setNewLinkTitle("");
    setNewLinkUrl("");
    setNewLinkIcon("link");
    
    toast({
      title: "Link added",
      description: `Added link to ${newLinkTitle}`,
    });
  };
  
  const handleRemoveLink = (index: number) => {
    if (!currentItem || !currentItem.otherLinks) return;
    
    const updatedLinks = [...currentItem.otherLinks];
    updatedLinks.splice(index, 1);
    
    setCurrentItem({
      ...currentItem,
      otherLinks: updatedLinks
    });
    
    toast({
      title: "Link removed",
      description: "The link has been removed",
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-nature-forest">
          Edit: {currentItem.title}
        </h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={currentItem.title}
              onChange={(e) => setCurrentItem({...currentItem, title: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="client">Client</Label>
            <Input 
              id="client" 
              value={currentItem.client}
              onChange={(e) => setCurrentItem({...currentItem, client: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={currentItem.description}
              onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Input 
              id="category" 
              value={currentItem.category}
              onChange={(e) => setCurrentItem({...currentItem, category: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="spotifyUrl">Spotify URL</Label>
            <Input 
              id="spotifyUrl" 
              placeholder="https://open.spotify.com/..."
              value={currentItem.spotifyUrl || ""}
              onChange={(e) => setCurrentItem({...currentItem, spotifyUrl: e.target.value})}
            />
          </div>
          
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
                onAddLink={handleAddLink}
                onRemoveLink={handleRemoveLink}
              />
            </TabsContent>
          </Tabs>
          
          <div className="pt-4 flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentItem(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={onUpdate}
              className="bg-nature-forest hover:bg-nature-leaf"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemEditor;
