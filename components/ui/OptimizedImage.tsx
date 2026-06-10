import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  quality?: number;
  fill?: boolean;
  onLoadingComplete?: () => void;
}

/**
 * Componente de imagen optimizado con:
 * - Formatos modernos (avif, webp)
 * - Lazy loading automático
 * - Placeholder de esqueleto
 * - Manejo de errores
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  sizes,
  priority = false,
  className = '',
  quality = 75,
  fill = false,
  onLoadingComplete,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoadingComplete = () => {
    setLoaded(true);
    onLoadingComplete?.();
  };

  if (error) {
    return (
      <div
        className={`bg-gradient-to-br from-bg-elevated to-surface flex items-center justify-center ${
          fill ? 'absolute inset-0' : ''
        } ${className}`}
        style={!fill && width && height ? { width, height } : undefined}
      >
        <span className="text-xs text-muted">Imagen no disponible</span>
      </div>
    );
  }

  return (
    <>
      {!loaded && !priority && (
        <div
          className={`absolute inset-0 animate-pulse bg-gradient-to-br from-bg-elevated via-surface to-bg-elevated ${
            fill ? '' : 'relative'
          }`}
          aria-hidden="true"
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        quality={quality}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        className={`${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ${className}`}
        onLoadingComplete={handleLoadingComplete}
        onError={() => setError(true)}
        placeholder="empty"
      />
    </>
  );
}
