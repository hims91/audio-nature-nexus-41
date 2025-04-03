
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortfolioItem } from "@/data/portfolio";

interface ImageUploaderProps {
  currentItem: PortfolioItem;
  imageFile: File | null;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  imageFileName: string;
  setImageFileName: React.Dispatch<React.SetStateAction<string>>;
  imagePreview: string | null;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  toast: any;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentItem,
  imageFile,
  setImageFile,
  imageFileName,
  setImageFileName,
  imagePreview,
  setImagePreview,
  toast
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size before creating preview
      const fileSizeInMB = file.size / 1024 / 1024;
      if (fileSizeInMB > 2) {
        toast({
          title: "Image too large",
          description: "Please use an image smaller than 2MB to avoid storage issues",
          variant: "destructive"
        });
        return;
      }
      
      setImageFile(file);
      setImageFileName(file.name);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Label htmlFor="image">Featured Image</Label>
      <div className="flex items-center gap-2 mt-1">
        <div className="flex-grow">
          <Input
            id="image"
            className="cursor-pointer"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        {imageFileName && (
          <div className="text-sm text-nature-forest">
            {imageFileName}
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Upload JPG, PNG, or other image files
      </p>
      
      <div className="mt-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium mb-2">Current Image:</p>
          <div className="border rounded-md overflow-hidden h-48">
            <img 
              src={currentItem.imageUrl} 
              alt={currentItem.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {imagePreview && (
          <div className="flex-1">
            <p className="text-sm font-medium mb-2">New Image Preview:</p>
            <div className="border rounded-md overflow-hidden h-48">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
