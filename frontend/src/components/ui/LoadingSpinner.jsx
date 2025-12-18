import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'gold' }) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    gold: 'text-gold-500',
    beige: 'text-beige-500',
    noir: 'text-noir-500',
    white: 'text-white'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin rounded-full border-4 border-solid border-current border-r-transparent`}></div>
    </div>
  );
};

export const PageLoader = () => (
  <div className="fixed inset-0 bg-noir-900 flex items-center justify-center z-50">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-gold-400/30 rounded-full"></div>
      <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-gold-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      <div className="absolute top-2 left-2 w-16 h-16 border-4 border-b-gold-400 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slow"></div>
    </div>
  </div>
);

export const ShimmerLoader = () => (
  <div className="animate-pulse">
    <div className="space-y-4">
      <div className="h-4 bg-noir-800 rounded w-3/4"></div>
      <div className="h-4 bg-noir-800 rounded"></div>
      <div className="h-4 bg-noir-800 rounded w-5/6"></div>
    </div>
  </div>
);

export default LoadingSpinner;