
import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
  height?: string;
  width?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  lines = 1, 
  height = "h-4",
  width = "w-full",
  ...props 
}) => {
  if (lines === 1) {
    return (
      <div
        className={cn(
          "animate-pulse bg-gray-200 rounded",
          height,
          width,
          className
        )}
        {...props}
      />
    );
  }

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "animate-pulse bg-gray-200 rounded",
            height,
            index === lines - 1 ? "w-3/4" : width // Last line shorter
          )}
        />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC<{ showAvatar?: boolean }> = ({ showAvatar = false }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border space-y-3">
    {showAvatar && (
      <div className="flex items-center space-x-3 space-x-reverse">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton height="h-4" width="w-1/2" />
          <Skeleton height="h-3" width="w-1/3" />
        </div>
      </div>
    )}
    <Skeleton lines={2} />
    <Skeleton height="h-8" width="w-1/4" />
  </div>
);

export const SkeletonChart: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <Skeleton height="h-6" width="w-1/3" className="mb-4" />
    <div className="space-y-2">
      {/* Chart bars simulation */}
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex items-end space-x-2 space-x-reverse">
          <Skeleton height="h-3" width="w-16" />
          <Skeleton 
            height={`h-${Math.floor(Math.random() * 20) + 8}`} 
            width="w-full" 
          />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
    {/* Table header */}
    <div className="border-b p-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} height="h-4" width="w-3/4" />
        ))}
      </div>
    </div>
    
    {/* Table rows */}
    <div className="divide-y">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton 
                key={colIndex} 
                height="h-4" 
                width={colIndex === 0 ? "w-full" : `w-${Math.floor(Math.random() * 3) + 2}/4`} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonDashboard: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton height="h-8" width="w-64" />
        <Skeleton height="h-4" width="w-48" />
      </div>
      <Skeleton height="h-10" width="w-32" />
    </div>
    
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
    
    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkeletonChart />
      <SkeletonChart />
    </div>
    
    {/* Table */}
    <SkeletonTable />
  </div>
);

export const SkeletonChatMessage: React.FC<{ isUser?: boolean }> = ({ isUser = false }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
      isUser ? 'bg-blue-500 text-white' : 'bg-white border'
    }`}>
      <Skeleton 
        lines={Math.floor(Math.random() * 3) + 1}
        className={isUser ? 'bg-blue-400' : 'bg-gray-200'}
      />
    </div>
  </div>
);
