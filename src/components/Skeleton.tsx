import clsx from "clsx";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "bg-gray-200 shimmer-skeleton rounded cursor-wait",
        className,
      )}
    />
  );
}
