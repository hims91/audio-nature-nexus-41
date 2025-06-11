
import { useState } from "react";
import { PortfolioItem } from "@/data/portfolio";
import { validateFormData, createFormSubmissionData } from "./formValidation";

interface UseFormSubmissionProps {
  mode: "create" | "edit";
  item?: PortfolioItem;
  onSave: (item: any) => void;
  toast: any;
}

export function useFormSubmission({ mode, item, onSave, toast }: UseFormSubmissionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (
    formData: Omit<PortfolioItem, "id" | "createdAt">,
    coverImageFile: File | null,
    audioFile: File | null,
    videoFile: File | null
  ) => {
    setIsSubmitting(true);
    
    const validation = validateFormData(formData);
    
    if (!validation.isValid) {
      toast({
        title: "Missing Information",
        description: validation.errors[0],
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    const updatedData = createFormSubmissionData(formData, coverImageFile, audioFile, videoFile);
    
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
    
    setIsSubmitting(false);
  };
  
  return {
    handleSubmit,
    isSubmitting
  };
}
