import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

const ImageOptimized = ({ 
  src, 
  alt, 
  className = '', 
  width,
  height,
  priority = false,
  lazy = true,
  fallback = '/images/placeholder.jpg'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder shimmer */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-noir-800 via-noir-700 to-noir-800" />
      )}

      {/* Loading spinner */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-400 border-t-transparent"></div>
        </div>
      )}

      {/* Image */}
      <motion.img
        src={error ? fallback : src}
        alt={alt}
        width={width}
        height={height}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        fetchpriority={priority ? 'high' : 'auto'}
      />

      {/* Progressive enhancement for WebP */}
      <picture className="hidden">
        <source srcSet={src?.replace(/\.(jpg|png)$/, '.webp')} type="image/webp" />
        <source srcSet={src} type={`image/${src?.split('.').pop()}`} />
      </picture>
    </div>
  );
};

export const BackgroundImage = ({ src, className = '', overlay = true }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundImage: `url(${src})` }}
        onLoad={() => setIsLoaded(true)}
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-noir-900/70 via-noir-900/50 to-noir-900/70" />
      )}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-noir-800 via-noir-700 to-noir-800" />
      )}
    </div>
  );
};

export default ImageOptimized;