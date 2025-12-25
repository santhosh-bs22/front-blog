import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
  type?: 'card' | 'text' | 'avatar' | 'image' | 'button';
  width?: string;
  height?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className,
  count = 1,
  type = 'card',
  width,
  height
}) => {
  const getSkeletonClass = () => {
    switch (type) {
      case 'card':
        return 'rounded-lg bg-muted';
      case 'text':
        return 'rounded bg-muted';
      case 'avatar':
        return 'rounded-full bg-muted';
      case 'image':
        return 'rounded bg-muted';
      case 'button':
        return 'rounded-md bg-muted';
      default:
        return 'rounded-lg bg-muted';
    }
  };

  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={cn(
        'animate-pulse',
        getSkeletonClass(),
        className,
        width && `w-${width}`,
        height && `h-${height}`
      )}
      style={{
        width: width?.includes('px') ? width : undefined,
        height: height?.includes('px') ? height : undefined
      }}
    />
  ));

  if (count === 1) {
    return skeletons[0];
  }

  return <>{skeletons}</>;
};

export default SkeletonLoader;