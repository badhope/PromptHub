'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({ 
  className = '', 
  variant = 'text',
  width,
  height,
  animation = 'pulse'
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export function SkillCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
      <div className="flex items-start justify-between">
        <Skeleton variant="rectangular" width={60} height={60} className="rounded-lg" />
        <div className="flex-1 ml-4 space-y-2">
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="40%" height={16} />
        </div>
      </div>
      <Skeleton variant="text" height={14} />
      <Skeleton variant="text" height={14} width="80%" />
      <div className="flex gap-2">
        <Skeleton variant="rectangular" width={60} height={24} className="rounded-full" />
        <Skeleton variant="rectangular" width={80} height={24} className="rounded-full" />
        <Skeleton variant="rectangular" width={70} height={24} className="rounded-full" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="flex gap-4">
          <Skeleton variant="text" width={60} height={12} />
          <Skeleton variant="text" width={60} height={12} />
        </div>
        <Skeleton variant="circular" width={32} height={32} />
      </div>
    </div>
  );
}

export function SkillListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkillCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function SkillDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start gap-4 mb-6">
          <Skeleton variant="rectangular" width={100} height={100} className="rounded-lg" />
          <div className="flex-1 space-y-3">
            <Skeleton variant="text" height={28} width="70%" />
            <Skeleton variant="text" height={20} width="50%" />
            <div className="flex gap-2 mt-2">
              <Skeleton variant="rectangular" width={80} height={28} className="rounded-full" />
              <Skeleton variant="rectangular" width={100} height={28} className="rounded-full" />
              <Skeleton variant="rectangular" width={90} height={28} className="rounded-full" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton variant="text" height={16} />
          <Skeleton variant="text" height={16} />
          <Skeleton variant="text" height={16} width="90%" />
          <Skeleton variant="text" height={16} width="85%" />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <Skeleton variant="text" height={24} width={60} className="mx-auto" />
            <Skeleton variant="text" height={14} width={40} className="mx-auto mt-1" />
          </div>
          <div className="text-center">
            <Skeleton variant="text" height={24} width={60} className="mx-auto" />
            <Skeleton variant="text" height={14} width={40} className="mx-auto mt-1" />
          </div>
          <div className="text-center">
            <Skeleton variant="text" height={24} width={60} className="mx-auto" />
            <Skeleton variant="text" height={14} width={40} className="mx-auto mt-1" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <Skeleton variant="text" height={24} width={120} className="mb-4" />
        <div className="space-y-3">
          <Skeleton variant="text" height={16} />
          <Skeleton variant="text" height={16} />
          <Skeleton variant="text" height={16} width="95%" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <Skeleton variant="text" height={24} width={100} className="mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={100} className="rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton variant="text" height={32} width={200} />
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} variant="rectangular" width={120} height={40} className="rounded-full" />
        ))}
      </div>
    </div>
  );
}

export function NavbarSkeleton() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Skeleton variant="rectangular" width={150} height={32} className="rounded" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton variant="rectangular" width={200} height={36} className="rounded-lg" />
            <Skeleton variant="circular" width={40} height={40} />
          </div>
        </div>
      </div>
    </nav>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="px-6 py-3">
                <Skeleton variant="text" height={16} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <Skeleton variant="text" height={14} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
