
import React from "react";

interface ImagePreviewProps {
  currentUrl?: string;
  imagePreview?: string;
  fileName?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  currentUrl,
  imagePreview,
  fileName
}) => {
  if (!currentUrl && !imagePreview) return null;
  
  return (
    <div className="mt-6 space-y-4">
      <h4 className="text-sm font-medium text-nature-forest">Preview</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Image */}
        {currentUrl && (
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
        
        {/* New Image Preview */}
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
            {fileName && (
              <p className="text-xs text-nature-bark mt-1">Will be saved as: {fileName}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;
