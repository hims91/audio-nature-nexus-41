
import React, { useState } from "react";
import { PortfolioItem, ExternalLink } from "@/types/portfolio";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ExternalLinksEditor from "./ExternalLinksEditor";
import { Image, Music, ExternalLink as ExternalLinkIcon } from "lucide-react";
import { createInitialFormData, validateFormData, type PortfolioFormData } from "./editor/PortfolioFormData";
import EditorHeader from "./editor/EditorHeader";
import DetailsTab from "./editor/DetailsTab";
import MediaTabs from "./editor/MediaTabs";
import EditorActions from "./editor/EditorActions";

interface PortfolioEditorProps {
  mode: "create" | "edit";
  item?: PortfolioItem;
  onSave: (item: any) => void;
  onDelete?: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const PortfolioEditor: React.FC<PortfolioEditorProps> = ({ 
  mode, 
  item, 
  onSave, 
  onDelete,
  onCancel,
  isLoading = false
}) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<PortfolioFormData>(
    createInitialFormData(item)
  );
  
  // Media files for upload
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  // Upload status tracking
  const [isAnyUploading, setIsAnyUploading] = useState<boolean>(false);
  const [canSave, setCanSave] = useState<boolean>(true);
  
  // Handle upload status changes
  const handleUploadStatusChange = (uploading: boolean, saveAllowed: boolean) => {
    setIsAnyUploading(uploading);
    setCanSave(saveAllowed);
  };
  
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

  // Handle recorded date change
  const handleRecordedDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ 
      ...prev, 
      recordedDate: date ? date.toISOString().split('T')[0] : null 
    }));
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
  
  // Handle form submission with upload validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if any uploads are in progress
    if (isAnyUploading) {
      toast({
        title: "Upload in Progress",
        description: "Please wait for all file uploads to complete before saving.",
        variant: "destructive"
      });
      return;
    }
    
    const validationError = validateFormData(formData);
    if (validationError) {
      toast({
        title: "Missing Information",
        description: validationError,
        variant: "destructive"
      });
      return;
    }
    
    console.log('💾 Saving portfolio item with form data:', formData);
    
    // Ensure all media URLs are properly included in the save data
    const saveData = {
      title: formData.title,
      client: formData.client,
      category: formData.category,
      description: formData.description,
      featured: formData.featured,
      externalLinks: formData.externalLinks,
      recordedDate: formData.recordedDate,
      // Explicitly include all media URLs with fallbacks
      coverImageUrl: formData.coverImageUrl || '',
      audioUrl: formData.audioUrl || '',
      videoUrl: formData.videoUrl || ''
    };
    
    console.log('💾 Final save data being sent:', saveData);
    
    // In edit mode, preserve the original ID and creation date
    if (mode === "edit" && item) {
      onSave({
        ...saveData,
        id: item.id,
        createdAt: item.createdAt
      });
    } else {
      onSave(saveData);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <EditorHeader 
          mode={mode}
          item={item}
          onDelete={onDelete}
          isLoading={isLoading}
        />
        
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
            <TabsContent value="details">
              <DetailsTab
                formData={formData}
                onInputChange={handleInputChange}
                onCategoryChange={handleCategoryChange}
                onFeaturedChange={handleFeaturedChange}
                onRecordedDateChange={handleRecordedDateChange}
                isLoading={isLoading}
              />
            </TabsContent>
            
            {/* Media Tabs */}
            <MediaTabs
              formData={formData}
              setFormData={setFormData}
              coverImageFile={coverImageFile}
              setCoverImageFile={setCoverImageFile}
              audioFile={audioFile}
              setAudioFile={setAudioFile}
              videoFile={videoFile}
              setVideoFile={setVideoFile}
              toast={toast}
              onUploadStatusChange={handleUploadStatusChange}
            />
            
            {/* External Links Tab */}
            <TabsContent value="links" className="py-4">
              <ExternalLinksEditor
                links={formData.externalLinks}
                onAddLink={handleAddExternalLink}
                onRemoveLink={handleRemoveExternalLink}
              />
            </TabsContent>
          </Tabs>
          
          <EditorActions
            mode={mode}
            onCancel={onCancel}
            isLoading={isLoading || isAnyUploading}
            canSave={canSave}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default PortfolioEditor;
