import clsx from "clsx";

interface EventSkeletonProps {
  count?: number;
  className?: string;
  withDesc?: boolean;
}

export default function EventSkeleton({
  count = 4,
  className,
  withDesc = false,
}: EventSkeletonProps) {
  return (
    /* 1. Use w-full to ensure it doesn't collapse */
    /* 2. Set a default grid layout that matches your actual UI */
    <div
      className={clsx(
        "w-full grid gap-6",
        className || "grid-cols-2 lg:grid-cols-5",
      )}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col items-start gap-2 w-full animate-pulse"
        >
          {/* IMAGE SKELETON */}
          <div className="w-full aspect-[16/9] bg-gray-200 rounded-xl" />

          {withDesc && (
            <div className="w-full space-y-3 mt-2">
              {/* TITLE SKELETON */}
              <div className="h-5 bg-gray-200 rounded-md w-3/4" />
              {/* DESC SKELETON */}
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
