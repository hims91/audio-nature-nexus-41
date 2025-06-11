
import { supabase } from '@/integrations/supabase/client';

export type FileUploadType = 'image' | 'audio' | 'video';

interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

const BUCKET_MAP: Record<FileUploadType, string> = {
  image: 'portfolio-images',
  audio: 'portfolio-audio',
  video: 'portfolio-videos'
};

// Normalize MIME types for better compatibility
const normalizeMimeType = (file: File): string => {
  const mimeType = file.type.toLowerCase();
  
  // Handle WAV file variations
  if (mimeType.includes('wav') || file.name.toLowerCase().endsWith('.wav')) {
    return 'audio/wav';
  }
  
  // Handle other audio types
  if (mimeType.includes('audio')) {
    return mimeType;
  }
  
  // Handle video types
  if (mimeType.includes('video')) {
    return mimeType;
  }
  
  // Handle image types
  if (mimeType.includes('image')) {
    return mimeType;
  }
  
  return mimeType;
};

const generateFilePath = (userId: string, fileName: string, type: FileUploadType): string => {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${userId}/${type}s/${timestamp}_${sanitizedFileName}`;
};

export const uploadFileToSupabase = async (
  file: File, 
  type: FileUploadType
): Promise<UploadResult> => {
  try {
    console.log(`Starting ${type} upload:`, file.name, 'Size:', file.size, 'Type:', file.type);
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return { 
        url: '', 
        path: '', 
        error: 'User must be authenticated to upload files' 
      };
    }

    const bucket = BUCKET_MAP[type];
    const filePath = generateFilePath(user.id, file.name, type);
    
    console.log('Uploading to bucket:', bucket, 'Path:', filePath);
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: normalizeMimeType(file)
      });

    if (error) {
      console.error('Upload error:', error);
      return { 
        url: '', 
        path: '', 
        error: `Upload failed: ${error.message}` 
      };
    }

    console.log('Upload successful:', data);

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;
    console.log('Public URL generated:', publicUrl);

    return {
      url: publicUrl,
      path: filePath
    };

  } catch (error) {
    console.error('Upload error:', error);
    return { 
      url: '', 
      path: '', 
      error: error instanceof Error ? error.message : 'Unknown upload error' 
    };
  }
};

export const deleteFileFromSupabase = async (
  filePath: string, 
  type: FileUploadType
): Promise<boolean> => {
  try {
    const bucket = BUCKET_MAP[type];
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};
