
import React, { useState, useCallback, memo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface OptimizedAvatarProps {
  src?: string | null;
  alt?: string;
  fallbackText?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  priority?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg'
};

const OptimizedAvatar = memo<OptimizedAvatarProps>(({ 
  src, 
  alt = 'Avatar', 
  fallbackText = 'U',
  className,
  size = 'md',
  priority = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // Generate optimized image URL if it's a URL
  const optimizedSrc = src && !imageError ? (
    src.startsWith('http') ? `${src}?w=128&h=128&fit=crop&crop=face&auto=format,compress&q=75` : src
  ) : undefined;

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {optimizedSrc && !imageError && (
        <AvatarImage
          src={optimizedSrc}
          alt={alt}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
      <AvatarFallback 
        className={cn(
          'bg-gradient-to-br from-nature-forest to-nature-leaf text-white font-medium',
          !isLoaded && optimizedSrc && 'animate-pulse'
        )}
      >
        {fallbackText}
      </AvatarFallback>
    </Avatar>
  );
});

OptimizedAvatar.displayName = 'OptimizedAvatar';

export default OptimizedAvatar;
