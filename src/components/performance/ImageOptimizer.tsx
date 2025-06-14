
import React, { useState, useEffect } from "react";

interface ImageOptimizerProps {
  src: string;
  alt: string;
  className?: string;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
  sizes?: string;
  priority?: boolean;
}

const ImageOptimizer: React.FC<ImageOptimizerProps> = ({
  src,
  alt,
  className = "",
  quality = 80,
  format = 'webp',
  sizes = "100vw",
  priority = false
}) => {
  const [optimizedSrc, setOptimizedSrc] = useState(src);
  const [isWebPSupported, setIsWebPSupported] = useState(false);

  useEffect(() => {
    // Check WebP support
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    setIsWebPSupported(ctx?.canvas.toDataURL('image/webp').indexOf('webp') > -1 || false);
  }, []);

  useEffect(() => {
    // Generate optimized image URL
    const optimizeImage = () => {
      if (src.startsWith('http') || src.startsWith('/lovable-uploads/')) {
        // For external URLs or already uploaded files, use as-is
        setOptimizedSrc(src);
        return;
      }

      // For local images, generate optimized versions
      const extension = src.split('.').pop()?.toLowerCase();
      let newSrc = src;

      if (isWebPSupported && format === 'webp' && extension !== 'webp') {
        newSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      }

      setOptimizedSrc(newSrc);
    };

    optimizeImage();
  }, [src, format, isWebPSupported]);

  const generateSrcSet = () => {
    const baseSrc = optimizedSrc.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    const extension = optimizedSrc.split('.').pop();
    
    return [
      `${baseSrc}_400.${extension} 400w`,
      `${baseSrc}_800.${extension} 800w`,
      `${baseSrc}_1200.${extension} 1200w`,
      `${optimizedSrc} 1600w`
    ].join(', ');
  };

  return (
    <picture>
      {isWebPSupported && format === 'webp' && (
        <source
          srcSet={generateSrcSet()}
          type="image/webp"
          sizes={sizes}
        />
      )}
      <img
        src={optimizedSrc}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        sizes={sizes}
        srcSet={generateSrcSet()}
      />
    </picture>
  );
};

export default ImageOptimizer;
