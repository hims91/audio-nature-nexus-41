import React, { useState } from "react";
import { PortfolioItem, ExternalLink } from "@/data/portfolio";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import MediaUploader from "./MediaUploader";
import ExternalLinksEditor from "./ExternalLinksEditor";
import { Save, Trash2, Image, Music, FileVideo, ExternalLink as ExternalLinkIcon, ArrowLeft } from "lucide-react";

interface PortfolioEditorProps {
  mode: "create" | "edit";
  item?: PortfolioItem;
  onSave: (item: any) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

const CATEGORIES = [
  "Mixing & Mastering", 
  "Sound Design", 
  "Podcasting", 
  "Sound for Picture", 
  "Dolby Atmos"
];

const PortfolioEditor: React.FC<PortfolioEditorProps> = ({ 
  mode, 
  item, 
  onSave, 
  onDelete,
  onCancel
}) => {
  const { toast } = useToast();
  
  // Create initial state based on mode and item
  const [formData, setFormData] = useState<Omit<PortfolioItem, "id" | "createdAt">>({
    title: item?.title || "",
    client: item?.client || "",
    category: item?.category || "Mixing & Mastering",
    description: item?.description || "",
    coverImageUrl: item?.coverImageUrl || "",
    coverImagePreview: item?.coverImagePreview || undefined,
    audioUrl: item?.audioUrl || undefined,
    videoUrl: item?.videoUrl || undefined,
    externalLinks: item?.externalLinks || [],
    featured: item?.featured || false
  });
  
  // Media files for upload
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  // Handle text input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle category selection
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value as PortfolioItem["category"] }));
  };
  
  // Handle featured toggle
  const handleFeaturedChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, featured: checked }));
  };
  
  // Handle external links
  const handleAddExternalLink = (link: ExternalLink) => {
    setFormData(prev => ({
      ...prev,
      externalLinks: [...prev.externalLinks, link]
    }));
  };
  
  const handleRemoveExternalLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      externalLinks: prev.externalLinks.filter((_, i) => i !== index)
    }));
  };

  // Handle file uploads
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
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a title for this portfolio item.",
        variant: "destructive"
      });
      return;
    }
    
    // In edit mode, preserve the original ID and creation date
    if (mode === "edit" && item) {
      onSave({
        ...formData,
        id: item.id,
        createdAt: item.createdAt
      });
    } else {
      onSave(formData);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-nature-forest">
            {mode === "create" ? "Create New Portfolio Item" : `Edit: ${item?.title}`}
          </h2>
          
          {mode === "edit" && onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this portfolio item and cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={onDelete}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="image" className="flex items-center">
                <Image className="h-4 w-4 mr-1.5" />
                Cover Image
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center">
                <Music className="h-4 w-4 mr-1.5" />
                Audio & Video
              </TabsTrigger>
              <TabsTrigger value="links" className="flex items-center">
                <ExternalLinkIcon className="h-4 w-4 mr-1.5" />
                External Links
              </TabsTrigger>
            </TabsList>
            
            {/* Details Tab */}
            <TabsContent value="details" className="py-4 space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input 
                    id="title" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="client">Client *</Label>
                  <Input 
                    id="client" 
                    name="client"
                    value={formData.client}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={handleFeaturedChange}
                  />
                  <Label htmlFor="featured" className="cursor-pointer">
                    Feature this item in the portfolio
                  </Label>
                </div>
              </div>
            </TabsContent>
            
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
            
            {/* External Links Tab */}
            <TabsContent value="links" className="py-4">
              <ExternalLinksEditor
                links={formData.externalLinks}
                onAddLink={handleAddExternalLink}
                onRemoveLink={handleRemoveExternalLink}
              />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between mt-8">
            <Button 
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            
            <Button 
              type="submit"
              className="bg-nature-forest hover:bg-nature-leaf"
            >
              <Save className="mr-2 h-4 w-4" />
              {mode === "create" ? "Create Item" : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PortfolioEditor;
