
import { Skeleton } from '@/components/ui/skeleton';

const StatusSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-4 space-y-4">
          {/* Header with user info */}
          <div className="flex items-center space-x-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Media placeholder */}
          <Skeleton className="w-full h-48 rounded-lg" />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusSkeleton;
