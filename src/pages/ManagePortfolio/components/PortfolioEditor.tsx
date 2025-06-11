
import React, { useState } from "react";
import { PortfolioItem, ExternalLink } from "@/data/portfolio";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import MediaUploader from "./MediaUploader";
import ExternalLinksEditor from "./ExternalLinksEditor";
import DetailsForm from "./editor/DetailsForm";
import FormHeader from "./editor/FormHeader";
import { useFormSubmission } from "./editor/useFormSubmission";
import { Save, Image, Music, FileVideo, ExternalLink as ExternalLinkIcon, ArrowLeft } from "lucide-react";

interface PortfolioEditorProps {
  mode: "create" | "edit";
  item?: PortfolioItem;
  onSave: (item: any) => void;
  onDelete?: () => void;
  onCancel: () => void;
  saveFileToPublic?: (file: File, directory: string) => Promise<{ success: boolean, path?: string, error?: string }>;
}

const PortfolioEditor: React.FC<PortfolioEditorProps> = ({ 
  mode, 
  item, 
  onSave, 
  onDelete,
  onCancel
}) => {
  const { toast } = useToast();
  const { handleSubmit, isSubmitting } = useFormSubmission({ mode, item, onSave, toast });
  
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
  
  // Handle form submission
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(formData, coverImageFile, audioFile, videoFile);
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <FormHeader mode={mode} item={item} onDelete={onDelete} />
        
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
            <TabsContent value="details" className="py-4">
              <DetailsForm
                formData={formData}
                onInputChange={handleInputChange}
                onCategoryChange={handleCategoryChange}
                onFeaturedChange={handleFeaturedChange}
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
              disabled={isSubmitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            
            <Button 
              type="submit"
              className="bg-nature-forest hover:bg-nature-leaf"
              disabled={isSubmitting}
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
