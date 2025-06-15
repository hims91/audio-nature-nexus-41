
import { supabase } from "@/integrations/supabase/client";

export interface FileUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export class FileUploadService {
  private static getBucketName(type: "image" | "audio" | "video" | "avatar"): string {
    switch (type) {
      case "image": return "portfolio-images";
      case "audio": return "portfolio-audio";
      case "video": return "portfolio-videos";
      case "avatar": return "avatars";
    }
  }

  private static generateFileName(originalName: string, userId?: string): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const userFolder = userId || 'anonymous';
    return `${userFolder}/${timestamp}_${randomId}_${sanitizedName}`;
  }

  private static isValidAudioFile(file: File): boolean {
    // Check file extension and MIME type for audio files
    const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];
    const audioMimeTypes = [
      'audio/mpeg', 
      'audio/wav', 
      'audio/wave', 
      'audio/x-wav',
      'audio/ogg', 
      'audio/mp4', 
      'audio/aac', 
      'audio/flac',
      'audio/x-m4a'
    ];
    
    const fileName = file.name.toLowerCase();
    const hasValidExtension = audioExtensions.some(ext => fileName.endsWith(ext));
    const hasValidMimeType = audioMimeTypes.includes(file.type);
    
    return hasValidExtension || hasValidMimeType;
  }

  private static isValidVideoFile(file: File): boolean {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
    const videoMimeTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
    
    const fileName = file.name.toLowerCase();
    const hasValidExtension = videoExtensions.some(ext => fileName.endsWith(ext));
    const hasValidMimeType = videoMimeTypes.includes(file.type);
    
    return hasValidExtension || hasValidMimeType;
  }

  private static isValidImageFile(file: File): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
    
    const fileName = file.name.toLowerCase();
    const hasValidExtension = imageExtensions.some(ext => fileName.endsWith(ext));
    const hasValidMimeType = imageMimeTypes.includes(file.type);
    
    return hasValidExtension || hasValidMimeType;
  }

  static async uploadFile(
    file: File, 
    type: "image" | "audio" | "video" | "avatar",
    onProgress?: (progress: UploadProgress) => void
  ): Promise<FileUploadResult> {
    try {
      // Validate file type
      let isValidFile = false;
      switch (type) {
        case "audio":
          isValidFile = this.isValidAudioFile(file);
          break;
        case "video":
          isValidFile = this.isValidVideoFile(file);
          break;
        case "image":
        case "avatar":
          isValidFile = this.isValidImageFile(file);
          break;
      }

      if (!isValidFile) {
        return {
          success: false,
          error: `Invalid ${type} file format. Please check the file extension and try again.`
        };
      }

      const bucketName = this.getBucketName(type);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          success: false,
          error: "Authentication required to upload files"
        };
      }

      // Generate unique file name
      const fileName = this.generateFileName(file.name, user.id);

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      console.log(`✅ File uploaded successfully: ${publicUrl}`);

      return {
        success: true,
        url: publicUrl,
        path: fileName
      };

    } catch (error) {
      console.error('File upload service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown upload error'
      };
    }
  }

  static async deleteFile(
    path: string, 
    type: "image" | "audio" | "video" | "avatar"
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const bucketName = this.getBucketName(type);
      
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([path]);

      if (error) {
        console.error('Delete error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      console.log(`✅ File deleted successfully: ${path}`);
      return { success: true };

    } catch (error) {
      console.error('File delete service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown delete error'
      };
    }
  }

  static async replaceFile(
    oldPath: string,
    newFile: File,
    type: "image" | "audio" | "video" | "avatar",
    onProgress?: (progress: UploadProgress) => void
  ): Promise<FileUploadResult> {
    try {
      // Upload new file first
      const uploadResult = await this.uploadFile(newFile, type, onProgress);
      
      if (!uploadResult.success) {
        return uploadResult;
      }

      // Delete old file
      await this.deleteFile(oldPath, type);

      return uploadResult;

    } catch (error) {
      console.error('File replace service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown replace error'
      };
    }
  }
}
