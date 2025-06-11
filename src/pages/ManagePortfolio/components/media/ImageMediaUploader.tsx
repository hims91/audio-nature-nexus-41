
import React from "react";
import { BaseMediaUploader, BaseMediaUploaderProps } from "./BaseMediaUploader";

interface ImageMediaUploaderProps extends Omit<BaseMediaUploaderProps, 'type' | 'children'> {
  imagePreview?: string;
  setImagePreview?: (preview: string) => void;
}

export const ImageMediaUploader: React.FC<ImageMediaUploaderProps> = ({
  currentUrl,
  imagePreview,
  setImagePreview,
  file,
  setFile,
  toast
}) => {
  const hasCurrentMedia = (url?: string) => url && url.trim() !== '';
  
  // Handle image file selection with preview
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !setImagePreview) return;
    
    const selectedFile = files[0];
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <BaseMediaUploader
      type="image"
      currentUrl={currentUrl}
      file={file}
      setFile={setFile}
      toast={toast}
    >
      <div className="mt-6 space-y-4">
        <h4 className="text-sm font-medium text-nature-forest">Preview</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hasCurrentMedia(currentUrl) && (
            <div>
              <p className="text-xs text-nature-bark mb-1">Current Image:</p>
              <div className="h-48 rounded-md overflow-hidden bg-gray-100 border">
                <img 
                  src={currentUrl} 
                  alt="Current cover" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                    e.currentTarget.className = "w-full h-full object-contain p-4";
                  }}
                />
              </div>
              <p className="text-xs text-nature-bark mt-1 truncate">{currentUrl}</p>
            </div>
          )}
          
          {imagePreview && (
            <div>
              <p className="text-xs text-nature-bark mb-1">New Image Preview:</p>
              <div className="h-48 rounded-md overflow-hidden bg-gray-100 border">
                <img 
                  src={imagePreview} 
                  alt="New cover preview" 
                  className="w-full h-full object-cover" 
                />
              </div>
              {file && (
                <p className="text-xs text-nature-bark mt-1">Will be saved as: {file.name}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </BaseMediaUploader>
  );
};
