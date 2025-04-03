
import React from "react";
import { PortfolioItem, ExternalLink } from "@/data/portfolio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft, Image, Music, FileVideo, ExternalLink as ExternalLinkIcon } from "lucide-react";
import DetailsTab from "./DetailsTab";
import MediaUploader from "../MediaUploader";
import ExternalLinksEditor from "../ExternalLinksEditor";
import { useToast } from "@/hooks/use-toast";

interface EditorFormProps {
  mode: "create" | "edit";
  formData: Omit<PortfolioItem, "id" | "createdAt">;
  setFormData: React.Dispatch<React.SetStateAction<Omit<PortfolioItem, "id" | "createdAt">>>;
  coverImageFile: File | null;
  setCoverImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  audioFile: File | null;
  setAudioFile: React.Dispatch<React.SetStateAction<File | null>>;
  videoFile: File | null;
  setVideoFile: React.Dispatch<React.SetStateAction<File | null>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const EditorForm: React.FC<EditorFormProps> = ({
  mode,
  formData,
  setFormData,
  coverImageFile,
  setCoverImageFile,
  audioFile,
  setAudioFile,
  videoFile,
  setVideoFile,
  onSubmit,
  onCancel
}) => {
  const { toast } = useToast();

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

  return (
    <form onSubmit={onSubmit}>
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
          <DetailsTab 
            title={formData.title}
            client={formData.client}
            category={formData.category}
            description={formData.description}
            featured={formData.featured}
            handleInputChange={handleInputChange}
            handleCategoryChange={handleCategoryChange}
            handleFeaturedChange={handleFeaturedChange}
          />
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
          />
          
          <MediaUploader
            type="video"
            currentUrl={formData.videoUrl}
            file={videoFile}
            setFile={setVideoFile}
            toast={toast}
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
  );
};

export default EditorForm;
