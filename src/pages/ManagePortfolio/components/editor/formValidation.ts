
import { PortfolioItem } from "@/data/portfolio";

export const validateFormData = (formData: Omit<PortfolioItem, "id" | "createdAt">) => {
  const errors: string[] = [];
  
  if (!formData.title.trim()) {
    errors.push("Title is required");
  }
  
  if (!formData.client.trim()) {
    errors.push("Client is required");
  }
  
  if (!formData.description.trim()) {
    errors.push("Description is required");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const createFormSubmissionData = (
  formData: Omit<PortfolioItem, "id" | "createdAt">,
  coverImageFile: File | null,
  audioFile: File | null,
  videoFile: File | null
) => {
  const updatedData = { ...formData };
  
  if (coverImageFile) {
    updatedData.coverImageUrl = `/images/${coverImageFile.name}`;
  }
  
  if (audioFile) {
    updatedData.audioUrl = `/audio/${audioFile.name}`;
  }
  
  if (videoFile) {
    updatedData.videoUrl = `/videos/${videoFile.name}`;
  }
  
  return updatedData;
};
