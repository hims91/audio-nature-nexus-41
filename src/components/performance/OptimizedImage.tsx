import React, { memo, useCallback, useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = memo(({
  src,
  alt,
  className = '',
  priority = false,
  quality = 80,
  sizes = '100vw',
  onLoad,
  onError
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setError(true);
    onError?.();
  }, [onError]);

  // Generate responsive image URLs for different screen sizes
  const generateSrcSet = useCallback((baseSrc: string) => {
    if (baseSrc.startsWith('http') || baseSrc.includes('lovable-uploads')) {
      return baseSrc; // External URLs or uploads - use as-is
    }

    const baseUrl = baseSrc.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    const extension = baseSrc.split('.').pop();
    
    return [
      `${baseUrl}_400w.${extension} 400w`,
      `${baseUrl}_800w.${extension} 800w`,
      `${baseUrl}_1200w.${extension} 1200w`,
      `${baseSrc} 1600w`
    ].join(', ');
  }, []);

  // Convert to WebP if supported
  const getOptimizedSrc = useCallback((originalSrc: string) => {
    if (originalSrc.includes('lovable-uploads') || originalSrc.startsWith('http')) {
      return originalSrc;
    }
    
    // For local images, prefer WebP
    const supportsWebP = typeof window !== 'undefined' && 
      (() => {
        const canvas = document.createElement('canvas');
        return canvas.toDataURL('image/webp').indexOf('webp') > -1;
      })();

    if (supportsWebP && !originalSrc.includes('.webp')) {
      return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    
    return originalSrc;
  }, []);

  if (error) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <picture>
      {/* WebP version for modern browsers */}
      <source
        srcSet={generateSrcSet(getOptimizedSrc(src))}
        type="image/webp"
        sizes={sizes}
      />
      
      {/* Fallback */}
      <img
        src={getOptimizedSrc(src)}
        alt={alt}
        className={`transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          aspectRatio: 'auto',
          objectFit: 'cover'
        }}
      />
    </picture>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;