
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Upload, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { portfolioItems, PortfolioItem } from "@/data/portfolio";

const ManagePortfolio: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<PortfolioItem[]>(portfolioItems);
  const [currentItem, setCurrentItem] = useState<PortfolioItem | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioFileName, setAudioFileName] = useState("");
  
  const handleSelectItem = (item: PortfolioItem) => {
    setCurrentItem(item);
    setAudioFileName("");
    setAudioFile(null);
  };
  
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check if file is audio
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an audio file (MP3, WAV, etc.)",
          variant: "destructive"
        });
        return;
      }
      
      setAudioFile(file);
      setAudioFileName(file.name);
    }
  };
  
  const handleUpdateItem = () => {
    if (!currentItem) return;
    
    // In a real application, this would upload the file to a server
    // For now, we'll simulate the update with a toast notification
    
    toast({
      title: "Portfolio item updated",
      description: audioFile 
        ? `Updated ${currentItem.title} with new audio: ${audioFileName}`
        : `Updated ${currentItem.title}`,
    });
    
    // If we had a real server, we would upload the file and get a URL back
    // Then update the item in the database
    // For now, we'll just update our local state
    
    const updatedItems = items.map(item => 
      item.id === currentItem.id 
        ? {...currentItem, audioUrl: audioFile ? URL.createObjectURL(audioFile) : currentItem.audioUrl} 
        : item
    );
    
    setItems(updatedItems);
    setCurrentItem(null);
    setAudioFile(null);
    setAudioFileName("");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 bg-nature-cream/30">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-nature-forest mb-4">Manage Portfolio</h1>
            <p className="text-nature-bark max-w-2xl mx-auto">
              Upload audio files for your portfolio items. These will be displayed on your portfolio page.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-nature-forest">Portfolio Items</h2>
                  <div className="space-y-2">
                    {items.map(item => (
                      <Button
                        key={item.id}
                        variant="outline"
                        className={`w-full justify-start ${
                          currentItem?.id === item.id ? 'bg-nature-forest text-white' : ''
                        }`}
                        onClick={() => handleSelectItem(item)}
                      >
                        <Music className="mr-2 h-4 w-4" />
                        {item.title}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              {currentItem ? (
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
                        <Label htmlFor="audio">Audio File</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-grow">
                            <Input
                              id="audio"
                              className="cursor-pointer"
                              type="file"
                              accept="audio/*"
                              onChange={handleAudioUpload}
                            />
                          </div>
                          {audioFileName && (
                            <div className="text-sm text-nature-forest">
                              {audioFileName}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Upload MP3, WAV, or other audio files
                        </p>
                      </div>
                      
                      <div className="pt-4 flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentItem(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleUpdateItem}
                          className="bg-nature-forest hover:bg-nature-leaf"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center p-8">
                    <Upload className="mx-auto h-12 w-12 text-nature-bark/50" />
                    <h3 className="mt-4 text-lg font-medium text-nature-forest">
                      Select a portfolio item
                    </h3>
                    <p className="mt-2 text-sm text-nature-bark">
                      Choose an item from the list to upload audio or edit details
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
