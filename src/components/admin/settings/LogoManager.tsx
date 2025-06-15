
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUploadService } from '@/services/fileUpload';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Loader2, Image } from 'lucide-react';

interface LogoManagerProps {
  logoUrl: string | null;
  onLogoUpdate: (url: string | null) => void;
}

const LogoManager: React.FC<LogoManagerProps> = ({ logoUrl, onLogoUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const oldLogoPath = logoUrl ? logoUrl.split('/avatars/')[1] : null;
      const uploadResult = oldLogoPath
        ? await FileUploadService.replaceFile(oldLogoPath, file, 'avatar')
        : await FileUploadService.uploadFile(file, 'avatar');

      if (uploadResult.success && uploadResult.url) {
        onLogoUpdate(uploadResult.url);
        toast({ title: "Success", description: "Logo updated successfully." });
      } else {
        throw new Error(uploadResult.error || 'Failed to upload logo.');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'An error occurred while updating the logo.',
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteLogo = async () => {
    if (!logoUrl) return;

    setIsUploading(true);
    try {
      const logoPath = logoUrl.split('/avatars/')[1];
      if (logoPath) {
        await FileUploadService.deleteFile(logoPath, 'avatar');
      }
      onLogoUpdate(null);
      toast({ title: "Success", description: "Logo removed." });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'An error occurred while removing the logo.',
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Image className="h-5 w-5 mr-2 text-nature-forest" />
          Logo Management
        </CardTitle>
        <CardDescription>
          Upload and manage your site logo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-6">
          <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
            {logoUrl ? (
              <img src={logoUrl} alt="Site Logo" className="w-full h-full object-contain rounded-lg" />
            ) : (
              <div className="text-center">
                <Image className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">No logo</p>
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/gif, image/svg+xml"
              className="hidden"
              disabled={isUploading}
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              {logoUrl ? 'Change Logo' : 'Upload Logo'}
            </Button>
            {logoUrl && (
              <Button variant="destructive" onClick={handleDeleteLogo} disabled={isUploading}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Logo
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Recommended: PNG or SVG format, max 2MB. Logo will be automatically resized to fit.
        </p>
      </CardContent>
    </Card>
  );
};

export default LogoManager;
