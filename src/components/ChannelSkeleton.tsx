
import { Skeleton } from '@/components/ui/skeleton';

const ChannelSkeleton = () => {
  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {[...Array(3)].map((_, index) => (
        <div key={index}>
          <div className="p-4">
            <div className="flex items-start space-x-4">
              {/* Channel Thumbnail */}
              <Skeleton className="w-16 h-20 rounded-lg flex-shrink-0" />
              
              {/* Channel Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-20 ml-2" />
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            </div>
          </div>
          {index < 2 && <div className="border-b border-gray-200" />}
        </div>
      ))}
    </div>
  );
};

export default ChannelSkeleton;
