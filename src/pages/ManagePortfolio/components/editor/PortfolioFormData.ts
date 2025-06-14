
import { PortfolioItem, ExternalLink } from "@/types/portfolio";

export interface PortfolioFormData extends Omit<PortfolioItem, "id" | "createdAt"> {}

export const createInitialFormData = (item?: PortfolioItem): PortfolioFormData => ({
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

export const validateFormData = (formData: PortfolioFormData): string | null => {
  if (!formData.title.trim()) {
    return "Please provide a title for this portfolio item.";
  }
  return null;
};
