
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { portfolioItems as initialPortfolioItems, PortfolioItem } from "@/data/portfolio";
import { Upload } from "lucide-react";

// Import all our new components
import PortfolioItemsList from "./components/PortfolioItemsList";
import ItemEditor from "./components/ItemEditor";
import { useLocalStorage } from "./hooks/useLocalStorage";

const ManagePortfolio: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, setItems, saveItems } = useLocalStorage();
  
  const [currentItem, setCurrentItem] = useState<PortfolioItem | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioFileName, setAudioFileName] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFileName, setVideoFileName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileName, setImageFileName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkIcon, setNewLinkIcon] = useState("link");
  
  const handleSelectItem = (item: PortfolioItem) => {
    setCurrentItem(item);
    setAudioFileName("");
    setAudioFile(null);
    setVideoFileName("");
    setVideoFile(null);
    setImageFileName("");
    setImageFile(null);
    setImagePreview(null);
    setNewLinkTitle("");
    setNewLinkUrl("");
    setNewLinkIcon("link");
  };
  
  const handleUpdateItem = () => {
    if (!currentItem) return;
    
    try {
      // Create a copy of the current item to modify
      const updatedItem = { ...currentItem };
      
      if (audioFile) {
        updatedItem.audioUrl = `/audio/${audioFileName}`;
      }
      
      if (videoFile) {
        updatedItem.videoUrl = `/videos/${videoFileName}`;
      }
      
      // Handle image updates - store both path and preview
      if (imageFile && imagePreview) {
        // Store the server path for long-term reference
        updatedItem.imageUrl = `/images/${imageFileName}`;
        // Store the data URL for immediate preview
        updatedItem.imagePreviewUrl = imagePreview;
        
        // Inform user about manual file copying
        toast({
          title: "Image Updated",
          description: `Remember to manually copy '${imageFileName}' to your public/images/ directory for the image to appear permanently.`,
        });
      }
      
      // Update the items array with the modified item
      const updatedItems = items.map(item => 
        item.id === currentItem.id ? updatedItem : item
      );
      
      // Update state and save to localStorage
      setItems(updatedItems);
      saveItems(updatedItems);
      
      toast({
        title: "Portfolio item updated",
        description: "Your changes have been saved.",
      });
      
      if (audioFile || videoFile || imageFile) {
        toast({
          title: "Manual file upload required",
          description: "Please manually copy your media files to the appropriate public directories.",
        });
      }
      
      // Reset form state
      setCurrentItem(null);
      setAudioFile(null);
      setAudioFileName("");
      setVideoFile(null);
      setVideoFileName("");
      setImageFile(null);
      setImageFileName("");
      setImagePreview(null);
    } catch (error) {
      console.error("Error updating portfolio item:", error);
      toast({
        title: "Update Failed",
        description: "An error occurred while updating the portfolio item.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 bg-nature-cream/30">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-nature-forest mb-4">Manage Portfolio</h1>
            <p className="text-nature-bark max-w-2xl mx-auto">
              Upload audio, video, and image files for your portfolio items. These will be displayed on your portfolio page.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <PortfolioItemsList 
                items={items} 
                currentItemId={currentItem?.id} 
                onSelectItem={handleSelectItem} 
              />
            </div>
            
            <div className="md:col-span-2">
              {currentItem ? (
                <ItemEditor 
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
                  onUpdate={handleUpdateItem}
                  toast={toast}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center p-8">
                    <Upload className="mx-auto h-12 w-12 text-nature-bark/50" />
                    <h3 className="mt-4 text-lg font-medium text-nature-forest">
                      Select a portfolio item
                    </h3>
                    <p className="mt-2 text-sm text-nature-bark">
                      Choose an item from the list to upload audio, video, or edit details
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white"
            >
              Return to Homepage
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ManagePortfolio;
