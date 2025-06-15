
import React, { useState, useRef } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { FileUploadService } from '@/services/fileUpload';
import OptimizedAvatar from '@/components/performance/OptimizedAvatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Upload, Loader2 } from 'lucide-react';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';

const AvatarUploader: React.FC = () => {
  const { profile, updateProfile } = useUserProfile();
  const { user, userProfile } = useEnhancedAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const oldAvatarPath = profile?.avatar_url ? profile.avatar_url.split('/avatars/')[1] : null;
      const uploadResult = oldAvatarPath
        ? await FileUploadService.replaceFile(oldAvatarPath, file, 'avatar')
        : await FileUploadService.uploadFile(file, 'avatar');

      if (uploadResult.success && uploadResult.url) {
        await updateProfile({ avatar_url: uploadResult.url });
        toast({ title: "Success", description: "Avatar updated successfully." });
      } else {
        throw new Error(uploadResult.error || 'Failed to upload avatar.');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'An error occurred while updating the avatar.',
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteAvatar = async () => {
    if (!profile?.avatar_url) return;

    setIsUploading(true);
    try {
      const avatarPath = profile.avatar_url.split('/avatars/')[1];
      if (avatarPath) {
        await FileUploadService.deleteFile(avatarPath, 'avatar');
      }
      await updateProfile({ avatar_url: null });
      toast({ title: "Success", description: "Avatar removed." });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'An error occurred while removing the avatar.',
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getFallbackText = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name[0]}${userProfile.last_name[0]}`;
    }
    if (userProfile?.first_name) {
      return userProfile.first_name[0];
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <OptimizedAvatar
        src={profile?.avatar_url}
        fallbackText={getFallbackText()}
        size="xl"
        className="w-32 h-32 text-4xl"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/gif"
        className="hidden"
        disabled={isUploading}
      />
      <div className="flex space-x-2">
        <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
          {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
          {profile?.avatar_url ? 'Change' : 'Upload'}
        </Button>
        {profile?.avatar_url && (
          <Button variant="destructive" onClick={handleDeleteAvatar} disabled={isUploading}>
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default AvatarUploader;
