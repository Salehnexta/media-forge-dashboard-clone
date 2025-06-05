
import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 rounded",
        className
      )}
      {...props}
    />
  );
};

export const SkeletonCard: React.FC = () => (
  <div className="bg-white p-4 rounded-lg shadow-sm border space-y-3">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-8 w-1/2" />
    <Skeleton className="h-3 w-1/4" />
  </div>
);

export const SkeletonChart: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <Skeleton className="h-6 w-1/3 mb-4" />
    <Skeleton className="h-48 w-full" />
  </div>
);
