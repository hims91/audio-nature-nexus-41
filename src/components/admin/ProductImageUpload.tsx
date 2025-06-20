
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Image, Star } from 'lucide-react';
import { FileUploadService } from '@/services/fileUpload';
import { toast } from 'sonner';

interface ProductImage {
  id?: string;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
}

interface ProductImageUploadProps {
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
  maxImages?: number;
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 10
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;
    
    setIsUploading(true);
    const newImages: ProductImage[] = [];

    try {
      for (let i = 0; i < files.length && i < (maxImages - images.length); i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image file`);
          continue;
        }

        const result = await FileUploadService.uploadFile(file, 'image');
        
        if (result.success && result.url) {
          newImages.push({
            image_url: result.url,
            alt_text: file.name.split('.')[0],
            is_primary: images.length === 0 && newImages.length === 0,
            sort_order: images.length + newImages.length
          });
        } else {
          toast.error(`Failed to upload ${file.name}: ${result.error}`);
        }
      }

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
        toast.success(`${newImages.length} image(s) uploaded successfully`);
      }
    } catch (error) {
      toast.error('Failed to upload images');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // If we removed the primary image, make the first one primary
    if (images[index].is_primary && newImages.length > 0) {
      newImages[0].is_primary = true;
    }
    onImagesChange(newImages);
  };

  const handleSetPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      is_primary: i === index
    }));
    onImagesChange(newImages);
  };

  const handleAltTextChange = (index: number, altText: string) => {
    const newImages = images.map((img, i) => 
      i === index ? { ...img, alt_text: altText } : img
    );
    onImagesChange(newImages);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Product Images ({images.length}/{maxImages})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
            id="image-upload"
            disabled={isUploading || images.length >= maxImages}
          />
          <Label htmlFor="image-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-600">
                {isUploading ? 'Uploading...' : 'Click to upload images or drag and drop'}
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG, WEBP up to 10MB each
              </p>
            </div>
          </Label>
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group border rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-100">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || `Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Image Controls */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant={image.is_primary ? "default" : "secondary"}
                    onClick={() => handleSetPrimary(index)}
                  >
                    <Star className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                {/* Primary Badge */}
                {image.is_primary && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="default" className="text-xs">
                      Primary
                    </Badge>
                  </div>
                )}

                {/* Alt Text Input */}
                <div className="p-2">
                  <Input
                    placeholder="Alt text"
                    value={image.alt_text || ''}
                    onChange={(e) => handleAltTextChange(index, e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Image className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No images uploaded yet</p>
            <p className="text-sm">Upload some images to showcase your product</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductImageUpload;
