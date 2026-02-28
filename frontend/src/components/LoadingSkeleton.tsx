import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted", className)} />
  );
}

interface CardSkeletonProps {
  className?: string;
}

export function CardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-6 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <LoadingSkeleton className="h-4 w-24" />
        <LoadingSkeleton className="h-4 w-4 rounded-full" />
      </div>
      <LoadingSkeleton className="h-8 w-16" />
      <LoadingSkeleton className="h-3 w-20" />
    </div>
  );
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({ rows = 5, columns = 4, className }: TableSkeletonProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex gap-4 pb-2 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <LoadingSkeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <LoadingSkeleton
              key={colIndex}
              className={cn("h-4 flex-1", colIndex === 0 && "w-1/3")}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface ChartSkeletonProps {
  className?: string;
}

export function ChartSkeleton({ className }: ChartSkeletonProps) {
  return (
    <div className={cn("flex items-center justify-center h-[300px]", className)}>
      <div className="relative w-40 h-40">
        <LoadingSkeleton className="absolute inset-0 rounded-full" />
        <div className="absolute inset-4 rounded-full bg-card" />
      </div>
    </div>
  );
}
