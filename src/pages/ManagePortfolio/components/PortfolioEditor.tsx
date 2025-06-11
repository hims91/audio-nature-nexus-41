
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Save, Trash2, X } from "lucide-react";
import { PortfolioItem, CreatePortfolioItem, UpdatePortfolioItem, ExternalLink } from "@/types/portfolio";
import { useToast } from "@/hooks/use-toast";
import MediaUploader from "./MediaUploader";
import ExternalLinksEditor from "./ExternalLinksEditor";

interface PortfolioEditorProps {
  mode: "create" | "edit";
  item?: PortfolioItem;
  onSave: (item: CreatePortfolioItem | UpdatePortfolioItem) => void;
  onDelete?: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isDeleting?: boolean;
}

const PortfolioEditor: React.FC<PortfolioEditorProps> = ({
  mode,
  item,
  onSave,
  onDelete,
  onCancel,
  isLoading = false,
  isDeleting = false
}) => {
  const { toast } = useToast();
  
  // Form state
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([]);
  
  // Media files
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  // Current URLs for editing mode
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>("");
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("");
  
  // New uploaded URLs
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string>("");
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>("");

  // Initialize form when item changes
  useEffect(() => {
    if (mode === "edit" && item) {
      setTitle(item.title || "");
      setClient(item.client || "");
      setCategory(item.category || "");
      setDescription(item.description || "");
      setExternalLinks(item.external_links || []);
      setCurrentImageUrl(item.cover_image_url || "");
      setCurrentAudioUrl(item.audio_url || "");
      setCurrentVideoUrl(item.video_url || "");
    } else {
      // Reset form for create mode
      setTitle("");
      setClient("");
      setCategory("");
      setDescription("");
      setExternalLinks([]);
      setCurrentImageUrl("");
      setCurrentAudioUrl("");
      setCurrentVideoUrl("");
    }
    
    // Reset uploaded URLs
    setUploadedImageUrl("");
    setUploadedAudioUrl("");
    setUploadedVideoUrl("");
    
    // Reset files
    setImageFile(null);
    setAudioFile(null);
    setVideoFile(null);
  }, [mode, item]);

  const handleImageUploaded = (url: string, path: string) => {
    setUploadedImageUrl(url);
    console.log("Image uploaded:", url);
  };

  const handleAudioUploaded = (url: string, path: string) => {
    setUploadedAudioUrl(url);
    console.log("Audio uploaded:", url);
  };

  const handleVideoUploaded = (url: string, path: string) => {
    setUploadedVideoUrl(url);
    console.log("Video uploaded:", url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !client.trim() || !category.trim() || !description.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields (title, client, category, description).",
        variant: "destructive"
      });
      return;
    }

    const portfolioData = {
      title: title.trim(),
      client: client.trim(),
      category: category.trim(),
      description: description.trim(),
      cover_image_url: uploadedImageUrl || currentImageUrl || null,
      audio_url: uploadedAudioUrl || currentAudioUrl || null,
      video_url: uploadedVideoUrl || currentVideoUrl || null,
      external_links: externalLinks,
    };

    if (mode === "edit" && item) {
      onSave({
        id: item.id,
        ...portfolioData
      } as UpdatePortfolioItem);
    } else {
      onSave(portfolioData as CreatePortfolioItem);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {mode === "create" ? "Create New Portfolio Item" : `Edit: ${item?.title || "Portfolio Item"}`}
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter portfolio title"
                required
              />
            </div>
            <div>
              <Label htmlFor="client">Client *</Label>
              <Input
                id="client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Enter client name"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Music Production, Sound Design"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the project..."
              className="min-h-24"
              required
            />
          </div>

          {/* Media Uploaders */}
          <div className="grid md:grid-cols-1 gap-6">
            <MediaUploader
              type="image"
              currentUrl={currentImageUrl}
              file={imageFile}
              setFile={setImageFile}
              toast={toast}
              onFileUploaded={handleImageUploaded}
            />
            
            <MediaUploader
              type="audio"
              currentUrl={currentAudioUrl}
              file={audioFile}
              setFile={setAudioFile}
              toast={toast}
              onFileUploaded={handleAudioUploaded}
            />
            
            <MediaUploader
              type="video"
              currentUrl={currentVideoUrl}
              file={videoFile}
              setFile={setVideoFile}
              toast={toast}
              onFileUploaded={handleVideoUploaded}
            />
          </div>

          {/* External Links */}
          <ExternalLinksEditor
            links={externalLinks}
            onChange={setExternalLinks}
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="bg-nature-forest hover:bg-nature-leaf"
              disabled={isLoading}
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? 'Saving...' : mode === "create" ? "Create Portfolio Item" : "Save Changes"}
            </Button>
            
            {mode === "edit" && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            )}
            
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PortfolioEditor;
