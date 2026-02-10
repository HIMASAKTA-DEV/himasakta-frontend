import Skeleton from "@/components/Skeleton";
import clsx from "clsx";
import React from "react";

function SkeletonParagraph({ className }: { className?: string }) {
  return (
    <div className={clsx("space-y-2", className)}>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-10/12" />
    </div>
  );
}

export default SkeletonParagraph;
