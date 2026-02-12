import Skeleton from "@/components/Skeleton";
import clsx from "clsx";

function SkeletonHeaderSection({ className }: { className?: string }) {
  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export default SkeletonHeaderSection;
