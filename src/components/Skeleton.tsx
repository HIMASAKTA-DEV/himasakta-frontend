import clsx from "clsx";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div className={clsx("bg-gray-200 animate-pulse rounded", className)} />
  );
}
