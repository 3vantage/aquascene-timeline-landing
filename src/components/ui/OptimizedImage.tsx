'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string; // Base filename without extension
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
}

// Helper to get optimized image path
const getOptimizedPath = (src: string, size: string, format: string) => {
  const basePath = process.env.NODE_ENV === 'production' ? '/aquascene-waitlist' : '';
  return `${basePath}/images/optimized/${size}/${src}.${format}`;
};

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
  onLoad
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Try to use WebP first, fallback to JPEG
  const srcSet = {
    webp: `
      ${getOptimizedPath(src, 'mobile', 'webp')} 768w,
      ${getOptimizedPath(src, 'tablet', 'webp')} 1024w,
      ${getOptimizedPath(src, 'desktop', 'webp')} 1920w
    `,
    jpeg: `
      ${getOptimizedPath(src, 'mobile', 'jpg')} 768w,
      ${getOptimizedPath(src, 'tablet', 'jpg')} 1024w,
      ${getOptimizedPath(src, 'desktop', 'jpg')} 1920w
    `
  };

  if (hasError) {
    // Fallback to original image if optimized versions fail
    const basePath = process.env.NODE_ENV === 'production' ? '/aquascene-waitlist' : '';
    return (
      <Image
        src={`${basePath}/images/aquascaping/${src}.jpg`}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes}
        onLoad={() => {
          setIsLoading(false);
          onLoad?.();
        }}
      />
    );
  }

  return (
    <picture>
      {/* WebP for modern browsers */}
      <source
        type="image/webp"
        srcSet={srcSet.webp}
        sizes={sizes}
      />
      
      {/* JPEG fallback */}
      <source
        type="image/jpeg"
        srcSet={srcSet.jpeg}
        sizes={sizes}
      />
      
      {/* Default img tag with smallest size */}
      <img
        src={getOptimizedPath(src, 'mobile', 'jpg')}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => {
          setIsLoading(false);
          onLoad?.();
        }}
        onError={() => setHasError(true)}
      />
    </picture>
  );
};

// Specialized component for hero images
export const HeroImage: React.FC<Omit<OptimizedImageProps, 'sizes'>> = (props) => {
  return (
    <OptimizedImage
      {...props}
      priority={true}
      sizes="100vw"
      className={`w-full h-full object-cover ${props.className || ''}`}
    />
  );
};

// Component for gallery images with lazy loading
export const GalleryImage: React.FC<OptimizedImageProps> = (props) => {
  const [isInView, setIsInView] = useState(false);
  const imgRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className="relative w-full h-full">
      {isInView ? (
        <OptimizedImage {...props} />
      ) : (
        <div className={`bg-gray-200 animate-pulse w-full h-full ${props.className || ''}`} />
      )}
    </div>
  );
};