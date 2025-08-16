import { useState, memo, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
  lazy?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage = memo(({
  src,
  alt,
  className,
  width,
  height,
  fallbackSrc = '/placeholder.svg',
  lazy = true,
  onLoad,
  onError,
}: OptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    setImageSrc(fallbackSrc);
    onError?.();
  }, [fallbackSrc, onError]);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={lazy ? 'lazy' : 'eager'}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'optimized-image transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          hasError && 'opacity-50'
        )}
        decoding="async"
        style={{
          contentVisibility: 'auto',
          containIntrinsicSize: width && height ? `${width}px ${height}px` : 'auto',
        }}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';