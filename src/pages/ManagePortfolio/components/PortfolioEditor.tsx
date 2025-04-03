
import React, { useState } from "react";
import { PortfolioItem } from "@/data/portfolio";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmDialog from "./editor/DeleteConfirmDialog";
import EditorForm from "./editor/EditorForm";
import { AlertTriangle } from "lucide-react";

interface PortfolioEditorProps {
  mode: "create" | "edit";
  item?: PortfolioItem;
  onSave: (item: any) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

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
    
    // For new uploads, update file paths based on files that would be uploaded
    const updatedData = { ...formData };
    
    if (coverImageFile) {
      // Use the image preview for immediate display and also set the final path
      // In a real app, you'd upload the file to a server and get back a URL
      updatedData.coverImageUrl = `/images/${coverImageFile.name}`;
    }
    
    if (audioFile) {
      updatedData.audioUrl = `/audio/${audioFile.name}`;
    }
    
    if (videoFile) {
      updatedData.videoUrl = `/videos/${videoFile.name}`;
    }
    
    // In edit mode, preserve the original ID and creation date
    if (mode === "edit" && item) {
      onSave({
        ...updatedData,
        id: item.id,
        createdAt: item.createdAt
      });
    } else {
      onSave(updatedData);
    }
    
    // Alert about manual file copying
    if (coverImageFile || audioFile || videoFile) {
      toast({
        title: "Media File Reminder",
        description: "Remember to manually copy your media files to the appropriate public directories for them to be displayed.",
      });
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
            <DeleteConfirmDialog onDelete={onDelete} />
          )}
        </div>
        
        <EditorForm 
          mode={mode}
          formData={formData}
          setFormData={setFormData}
          coverImageFile={coverImageFile}
          setCoverImageFile={setCoverImageFile}
          audioFile={audioFile}
          setAudioFile={setAudioFile}
          videoFile={videoFile}
          setVideoFile={setVideoFile}
          onSubmit={handleSubmit}
          onCancel={onCancel}
        />
      </CardContent>
    </Card>
  );
};

export default PortfolioEditor;
