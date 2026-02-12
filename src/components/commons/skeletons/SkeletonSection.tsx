import clsx from "clsx";

export default function SkeletonSection() {
  return (
    <div className="w-full flex flex-col gap-6 animate-pulse">
      {/* VIEWER PORTION */}
      <div className="flex flex-col gap-3 w-full max-w-5xl mx-auto">
        {/* Frame Placeholder */}
        <div
          className={clsx(
            "relative w-full rounded-[1.5rem] bg-neutral-200 border-2 border-neutral-100",
            "aspect-video lg:aspect-auto lg:h-[55vh]",
          )}
        >
          {/* Subtle Inner Glow to mimic depth */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
        </div>
      </div>
    </div>
  );
}
