import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Video, Upload, Save, FileVideo, Music2, Trash2, PlusCircle, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { portfolioItems, PortfolioItem } from "@/data/portfolio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ManagePortfolio: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<PortfolioItem[]>(portfolioItems);
  const [currentItem, setCurrentItem] = useState<PortfolioItem | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioFileName, setAudioFileName] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFileName, setVideoFileName] = useState("");
  
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkIcon, setNewLinkIcon] = useState("link");
  
  const iconOptions = [
    { value: "link", label: "Generic Link" },
    { value: "youtube", label: "YouTube" },
    { value: "instagram", label: "Instagram" },
    { value: "facebook", label: "Facebook" },
    { value: "twitter", label: "Twitter" },
    { value: "linkedin", label: "LinkedIn" }
  ];
  
  const handleSelectItem = (item: PortfolioItem) => {
    setCurrentItem(item);
    setAudioFileName("");
    setAudioFile(null);
    setVideoFileName("");
    setVideoFile(null);
    setNewLinkTitle("");
    setNewLinkUrl("");
    setNewLinkIcon("link");
  };
  
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
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
  
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a video file (MP4, MOV, etc.)",
          variant: "destructive"
        });
        return;
      }
      
      setVideoFile(file);
      setVideoFileName(file.name);
    }
  };
  
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
  
  const handleUpdateItem = () => {
    if (!currentItem) return;
    
    let updatedAudioUrl = currentItem.audioUrl;
    let updatedVideoUrl = currentItem.videoUrl || "";
    
    if (audioFile) {
      updatedAudioUrl = `/audio/${audioFileName}`;
    }
    
    if (videoFile) {
      updatedVideoUrl = `/videos/${videoFileName}`;
    }
    
    const updatedItem = {
      ...currentItem,
      audioUrl: updatedAudioUrl,
      videoUrl: updatedVideoUrl
    };
    
    const updatedItems = items.map(item => 
      item.id === currentItem.id ? updatedItem : item
    );
    
    setItems(updatedItems);
    
    toast({
      title: "Portfolio item updated",
      description: [
        audioFile ? `Added audio: ${audioFileName}` : "",
        videoFile ? `Added video: ${videoFileName}` : ""
      ].filter(Boolean).join(", ") || "Updated details",
    });
    
    if (audioFile || videoFile) {
      toast({
        title: "Manual file upload required",
        description: `Please manually copy your ${audioFile ? "audio" : ""} ${audioFile && videoFile ? "and" : ""} ${videoFile ? "video" : ""} files to the ${audioFile ? "public/audio" : ""} ${audioFile && videoFile ? "and" : ""} ${videoFile ? "public/videos" : ""} directories.`,
      });
    }
    
    setCurrentItem(null);
    setAudioFile(null);
    setAudioFileName("");
    setVideoFile(null);
    setVideoFileName("");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 bg-nature-cream/30">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-nature-forest mb-4">Manage Portfolio</h1>
            <p className="text-nature-bark max-w-2xl mx-auto">
              Upload audio and video files for your portfolio items. These will be displayed on your portfolio page.
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
                      
                      <Tabs defaultValue="audio" className="w-full mt-6">
                        <TabsList className="grid w-full grid-cols-3">
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
                        
                        <TabsContent value="audio" className="mt-4">
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
                            {currentItem.audioUrl && (
                              <div className="mt-2">
                                <p className="text-sm font-medium">Current Audio:</p>
                                <p className="text-xs text-nature-forest">{currentItem.audioUrl}</p>
                                <audio 
                                  controls 
                                  className="w-full mt-2 h-10" 
                                  src={currentItem.audioUrl}
                                />
                              </div>
                            )}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="video" className="mt-4">
                          <div>
                            <Label htmlFor="video">Video File</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-grow">
                                <Input
                                  id="video"
                                  className="cursor-pointer"
                                  type="file"
                                  accept="video/*"
                                  onChange={handleVideoUpload}
                                />
                              </div>
                              {videoFileName && (
                                <div className="text-sm text-nature-forest">
                                  {videoFileName}
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Upload MP4, MOV, or other video files
                            </p>
                            {currentItem.videoUrl && (
                              <div className="mt-2">
                                <p className="text-sm font-medium">Current Video:</p>
                                <p className="text-xs text-nature-forest">{currentItem.videoUrl}</p>
                                <video 
                                  controls 
                                  className="w-full mt-2 h-auto" 
                                  src={currentItem.videoUrl}
                                />
                              </div>
                            )}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="links" className="mt-4">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="spotifyUrl">Spotify Link</Label>
                              <Input 
                                id="spotifyUrl" 
                                placeholder="https://open.spotify.com/..."
                                value={currentItem.spotifyUrl || ""}
                                onChange={(e) => setCurrentItem({...currentItem, spotifyUrl: e.target.value})}
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Add a link to the Spotify album, track, or playlist
                              </p>
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-medium mb-2">Other Links</h3>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                                <Input 
                                  placeholder="Link title" 
                                  value={newLinkTitle}
                                  onChange={(e) => setNewLinkTitle(e.target.value)}
                                />
                                <Input 
                                  placeholder="URL (https://...)" 
                                  value={newLinkUrl}
                                  onChange={(e) => setNewLinkUrl(e.target.value)}
                                />
                                <div className="flex gap-2">
                                  <Select 
                                    value={newLinkIcon} 
                                    onValueChange={setNewLinkIcon}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Icon" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {iconOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Button 
                                    type="button" 
                                    size="icon" 
                                    onClick={handleAddLink}
                                    className="bg-nature-forest hover:bg-nature-leaf"
                                  >
                                    <PlusCircle className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              {currentItem.otherLinks && currentItem.otherLinks.length > 0 ? (
                                <div className="space-y-2">
                                  {currentItem.otherLinks.map((link, index) => (
                                    <div key={index} className="flex items-center justify-between border p-2 rounded">
                                      <div className="flex items-center">
                                        <div className="bg-nature-stone p-1 rounded mr-2">
                                          {(() => {
                                            switch(link.icon) {
                                              case 'youtube': return <Music className="h-4 w-4 text-white" />;
                                              case 'instagram': return <Music className="h-4 w-4 text-white" />;
                                              case 'facebook': return <Music className="h-4 w-4 text-white" />;
                                              case 'twitter': return <Music className="h-4 w-4 text-white" />;
                                              case 'linkedin': return <Music className="h-4 w-4 text-white" />;
                                              default: return <LinkIcon className="h-4 w-4 text-white" />;
                                            }
                                          })()}
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium">{link.title}</p>
                                          <p className="text-xs text-nature-bark truncate">{link.url}</p>
                                        </div>
                                      </div>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleRemoveLink(index)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground italic">No additional links added yet</p>
                              )}
                            </div>
                          </div>
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
